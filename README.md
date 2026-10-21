# Reverse Trailer Campaign

Web-App, die Filmmarketing **rückwärts** erklärt: vom Box-Office-Ergebnis über Besucher, Kaufabsicht und Reichweite bis zur ersten Idee, verteilt auf 11 Marketing-Ebenen.

Start: `index.html` im Browser öffnen (kein Build, keine Abhängigkeiten) oder `python3 -m http.server`.

| Bereich | Inhalt |
|---|---|
| Rückwärts-Rechner | Ziel-Einspiel → Besucher → Opening/Laufzeit → Reichweite → Paid Media → Budget je Ebene, plus Kino-Break-even |
| 11 Ebenen | Mechanismus, Taktiken, KPIs, Beispiele, Risiko je Ebene |
| Zeitleiste | Meilensteine von T-3 Jahre bis T+6 Monate, rückwärts oder chronologisch, mit echten Datumsangaben |
| Fallstudien | 8 Filme rückwärts erzählt, mit Ebenen-Heatmap (inkl. Gegenbeispiel) |
| Warum es wirkt | 9 Wirkmechanismen und 5 Kaufbarrieren |

## Hinweis zu den Daten
Filmzahlen in `data.js` sind öffentlich berichtete Näherungswerte. Die Rechner-Parameter (Opening-Anteil, Konversionsraten, CPM, Budgetverteilung) sind editierbare Faustwerte, keine gemessenen Branchenwerte. Vor externer Verwendung prüfen.

Dateien: `data.js` (Inhalte), `calc.js` (Rückwärts-Modell), `app.js` (UI), `styles.css`.
