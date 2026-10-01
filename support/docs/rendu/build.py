"""Assemble repository Markdown as local, print-ready HTML; no application data."""
from pathlib import Path
import hashlib
import html
import json
import re
import subprocess
import sys
from urllib.parse import unquote, urlsplit
from markdown_it import MarkdownIt

ROOT = Path(__file__).resolve().parents[2]
OUT = Path(__file__).resolve().parent
HEAD = subprocess.check_output(["git", "rev-parse", "HEAD"], cwd=ROOT, text=True).strip()
REPO = "https://github.com/christopherDEPASQUAL/RGPD"
DOCS = [
    ("a1", "A.1 — Registre des traitements", "A", "docs/dossier/partie-a/01-registre-des-traitements.md"),
    ("a2", "A.2 — Bases légales et acteurs", "A", "docs/dossier/partie-a/02-bases-legales-et-acteurs.md"),
    ("a3", "A.3 — Analyse d'impact", "A", "docs/dossier/partie-a/03-aipd-questionnaires-sante.md"),
    ("a4", "A.4 — Non-conformités RGPD", "A", "docs/dossier/partie-a/04-non-conformites-rgpd.md"),
    ("b1", "B.1 — Constats de sécurité", "B", "docs/dossier/partie-b/01-constats-securite.md"),
    ("b2", "B.2 — Scénarios de fuite", "B", "docs/dossier/partie-b/02-scenarios-de-fuite-et-rgpd.md"),
    ("b3", "B.3 — Violation et notifications", "B", "docs/dossier/partie-b/03-violation-et-notifications.md"),
    ("c1", "C.1 — Plan de remédiation", "C", "docs/dossier/partie-c/01-plan-de-remediation.md"),
    ("c2", "C.2 — Correctifs et preuves", "C", "docs/dossier/partie-c/02-correctifs-et-preuves.md"),
    ("c3", "C.3 — Risques résiduels", "C", "docs/dossier/partie-c/03-risques-residuels.md"),
    ("d", "D — Pilotage agile", "D", "docs/dossier/partie-d/README.md"),
    ("ia", "Annexe 1 — Transparence IA", "annexe", "docs/dossier/annexes/01-transparence-ia.md"),
    ("backlog", "Annexe 2 — Backlog détaillé", "annexe", "docs/dossier/partie-d/annexes/backlog-detaille.md"),
    ("planning", "Annexe 3 — Données de planification", "annexe", "docs/dossier/partie-d/annexes/planning.json"),
    ("sourcesd", "Annexe 4 — Sources et contrôles de D", "annexe", "docs/dossier/partie-d/annexes/sources-et-controles.md"),
    ("preuves", "Annexe 5 — Preuves initiales", "annexe", "docs/audit/preuves/01-preuves-execution.md"),
    ("recette", "Annexe 6 — Fiabilisation et recettes", "annexe", "docs/audit/preuves/04-fiabilisation-et-recette.md"),
]
IDS = {(ROOT / item[3]).resolve(): item[0] for item in DOCS}
md = MarkdownIt("commonmark", {"html": True}).enable("table")


def rewrite_tokens(tokens, source):
    local_only = False
    for token in tokens:
        if token.type == "link_open":
            href = token.attrGet("href") or ""
            parsed = urlsplit(href)
            if not parsed.scheme:
                target = (source.parent / unquote(parsed.path)).resolve() if parsed.path else source
                if target in IDS:
                    href = "#" + IDS[target] + ("--" + parsed.fragment if parsed.fragment else "")
                elif target.is_file() and target.is_relative_to(ROOT):
                    relative = target.relative_to(ROOT).as_posix()
                    # Never fabricate a GitHub link to a not-yet-published deliverable.
                    tracked = subprocess.run(["git", "cat-file", "-e", f"{HEAD}:support/{relative}"], cwd=ROOT, capture_output=True).returncode == 0
                    if not tracked:
                        token.tag = "span"
                        token.attrs = {"title": "Livrable local distinct"}
                        local_only = True
                        continue
                    href = f"{REPO}/blob/{HEAD}/support/{relative}" + ("#" + parsed.fragment if parsed.fragment else "")
                else:
                    raise ValueError(f"Unresolved reference in {source.name}: {href}")
                token.attrSet("href", href)
        elif token.type == "link_close" and local_only:
            token.tag = "span"
            local_only = False
        if token.children:
            rewrite_tokens(token.children, source)


def render(source, identifier):
    text = source.read_text(encoding="utf-8")
    if identifier == "d":
        # Editorial assembly instruction, not assessed analysis; retained in source.
        text = re.sub(r"\n---\s*\n\s*Pour l'assemblage :[^\n]+\s*$", "\n", text)
    if re.search(r"<(script|iframe|img|style)\b", text, re.I):
        raise ValueError("Unexpected active/remote HTML in document source")
    tokens = md.parse(text)
    rewrite_tokens(tokens, source)
    result = md.renderer.render(tokens, md.options, {})
    # Preserve explicit anchors used for the sources of D; namespace headings in JS.
    result = re.sub(r'id="([^"]+)"', lambda m: f'id="{identifier}--{html.escape(m[1])}"', result)
    return result


def planning(source):
    data = json.loads(source.read_text(encoding="utf-8"))
    rows = [dict(zip(data["columns"], row)) for row in data["tickets"]]
    lines = ["# Données chiffrées de planification", data["status"],
             "Valeurs issues de `planning.json`, présentées en tableaux pour la lecture. Les hypothèses et limites de D restent applicables.",
             "## Disponibilités et taux hypothétiques", "| Rôle | Personnes | Brut / événements / réserve / net (JP) | Taux €/JP |", "|---|---|---|---|"]
    for role, value in data["roles"].items():
        lines.append(f"| {role} | {value['people']} | {value['gross_jp']} / {value['events_jp']} / {value['reserve_jp']} / {value['net_jp']} | {value['rate_eur_per_jp']} |")
    lines += ["## Charges par ticket", "| Ticket / phase | DEV / QA / OPS / PO / DPO / RSSI (JP) | Total JP |", "|---|---|---|"]
    roles = ["DEV", "QA", "OPS", "PO", "DPO", "RSSI"]
    for row in rows:
        values = " / ".join(str(row[r]) for r in roles)
        lines.append(f"| {row['id']} / {row['phase']} | {values} | {sum(row[r] for r in roles)} |")
    lines += ["## Priorité, dépendances et confiance", "| Ticket | Priorité / risque / valeur | Dépendances | Confiance |", "|---|---|---|---|"]
    for row in rows:
        lines.append(f"| {row['id']} | {row['priority']} / {row['risk']} / {row['value']} | {', '.join(row['dependencies']) or 'Aucune'} | {row['confidence']} |")
    lines += ["## Hypothèses complémentaires", f"Une journée-personne représente {data['hours_per_jp']} heures; une période compte {data['sprint_working_days']} jours ouvrés.",
              "Indice : " + data["priority_formula"],
              f"Coordination immédiate : {data['immediate_coordination']['effort_jp']} JP SM. Provision d'environnement : {data['environment_allowance_eur']} €.",
              data["budget_basis"], "### Exclusions budgétaires"]
    lines += ["- " + item for item in data["budget_exclusions"]]
    lines += ["### Conditions extérieures au lancement"] + ["- " + item for item in data["external_release_prerequisites"]]
    lines += ["### Après la troisième période", data["after_S3_until_Jp90"]]
    return md.render("\n\n".join(lines[:3]) + "\n\n" + "\n".join(lines[3:]))


articles = []
manifest = []
for identifier, title, group, relative in DOCS:
    source = (ROOT / relative).resolve()
    contents = planning(source) if source.suffix == ".json" else render(source, identifier)
    if identifier == "preuves":
        contents = contents.replace("</h1>", '</h1><aside>Document historique : les procédures et résultats ci-dessous sont conservés. La procédure actuelle de l’annexe 6 prévaut; le lanceur vérifié supprime ses fichiers temporaires, même si l’ancienne procédure mentionne AUDIT_KEEP_TEMP.</aside>', 1)
    if identifier == "recette":
        contents = contents.replace("</h1>", '</h1><aside>Les mentions « non commité » et « aucun push » décrivent les recettes antérieures. Les retouches ont ensuite été publiées au commit 3d00b4b, contrôlé sur copie propre et en CI Linux/Windows : <a href="https://github.com/christopherDEPASQUAL/RGPD/actions/runs/36909164181">recette du commit publié</a>.</aside>', 1)
    articles.append(f'<article data-id="{identifier}" data-title="{html.escape(title)}" data-group="{group}">{contents}</article>')
    manifest.append({"path": relative, "sha256": hashlib.sha256(source.read_bytes()).hexdigest()})

cover = f"""<div class="cover-label">UE04 · Produit et storytelling</div>
<h1 class="cover-title">WellWork<br><span>Audit RGPD<br>et sécurité</span></h1>
<p class="cover-sub">Dossier de remédiation et pilotage agile</p>
<div class="cover-author">Christopher De Pasqual<br>1er octobre 2026</div>
<aside><strong>Le résultat en bref</strong><br>Les accès aux profils et questionnaires sont restreints, les sessions et mots de passe renforcés, et l’export assureur suspendu. Le plan de remédiation traite les points encore ouverts : usages des données de santé, habilitations, conservation et sauvegardes.</aside>
<p class="cover-meta">Parties A–D : <strong id="body-count">…</strong> pages, couverture et sommaire compris.<br>Annexes : <strong id="annex-count">…</strong> pages, identifiées séparément.<br>La présentation E est un livrable distinct.</p>
<p class="cover-meta"><a href="{REPO}/tree/review/retouches-audit-partie-d">Code, historique des corrections et preuves</a></p>"""

payload = """<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>WellWork — Dossier de remédiation</title><link rel="stylesheet" href="report.css"></head><body>
<div id="pages"></div><div id="source" hidden>""" + "".join(articles) + '</div><template id="cover">' + cover + '</template><script src="paginate.js"></script></body></html>'
(OUT / "Dossier_remediation_WellWork.html").write_text(payload, encoding="utf-8")
(OUT / "sources.json").write_text(json.dumps({"head": HEAD, "sources": manifest}, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
sys.stdout.write(f"Assembled {len(DOCS)} documents from HEAD {HEAD}\n")
