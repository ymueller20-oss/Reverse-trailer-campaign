/* Inhalte der App. Zahlen zu Filmen sind öffentlich berichtete Näherungswerte (ca.).
   Modell-Parameter im Rechner sind Faustwerte und im UI editierbar – keine Messwerte. */
window.DATA = (function () {

  const FUNNEL = ['Awareness', 'Interest', 'Intent', 'Kauf', 'Advocacy'];

  const PHASES = [
    { id: 'fundament', name: 'Fundament', sub: 'Entscheidet, was überhaupt verkaufbar ist' },
    { id: 'aufbau', name: 'Aufbau', sub: 'Bekanntheit und Fan-Kern' },
    { id: 'verdichtung', name: 'Verdichtung', sub: 'Aus Interesse wird Kaufabsicht' },
    { id: 'release', name: 'Release & Nachwirkung', sub: 'Eröffnung kaufen, Laufzeit verdienen' }
  ];

  const LEVELS = [
    {
      id: 1, name: 'Produkt & Konzept', short: 'Produkt', phase: 'fundament',
      funnel: ['Awareness', 'Interest'], zeit: 'T-36 bis T-24 Monate',
      kurz: 'Marketing beginnt im Drehbuch: Was lässt sich in einem Satz und einem Bild verkaufen?',
      warum: 'Ein Film ist ein Erfahrungsgut: Das Publikum kann die Qualität vor dem Kauf nicht prüfen und verlässt sich auf Signale. Bekannte IP, Besetzung, Regie und Genre sind solche Signale. Sie senken das wahrgenommene Risiko und sparen später Media-Budget, weil ein Teil der Zielgruppe schon „vorverkauft“ ist.',
      taktiken: ['High-Concept-Prämisse (Logline trägt ohne Erklärung)', 'IP / Franchise / Vorlage mit eingebautem Publikum', 'Besetzung als Marketing-Asset (Reichweite, Fan-Basis)', 'Trailerbare Momente und ein „Poster-Bild“ schon im Skript planen', 'Altersfreigabe als Zielgruppen-Entscheidung (z. B. PG-13 vs. R)'],
      kpis: ['Ungestützte Bekanntheit der IP', 'Social-Reichweite der Besetzung', 'Concept-Testing-Score', 'Greenlight-Tracking'],
      beispiele: ['Barbie: 60 Jahre Markenwissen plus Gerwig, Robbie, Gosling', 'Deadpool: bewusste R-Rating-Entscheidung als Alleinstellungsmerkmal'],
      risiko: 'Wenn das Konzept nicht in einem Satz erklärbar ist, kann keine spätere Ebene das vollständig ausgleichen.'
    },
    {
      id: 2, name: 'Positionierung & Strategie', short: 'Strategie', phase: 'fundament',
      funnel: ['Awareness', 'Interest', 'Intent'], zeit: 'T-18 bis T-12 Monate',
      kurz: 'Zielgruppe, Kernbotschaft, Starttermin, Wettbewerbsfenster und Messlatte festlegen.',
      warum: 'Das Budget ist begrenzt, die Aufmerksamkeit auch. Wer alle erreichen will, erreicht niemanden stark genug. Positionierung entscheidet, welche Barriere (unbekannt, irrelevant, riskant, aufschiebbar) bei welcher Gruppe zuerst fallen muss, und der Starttermin entscheidet, gegen wen der Film um dieselben Kinoplätze und Wochenenden konkurriert.',
      taktiken: ['Four-Quadrant-Analyse (männlich/weiblich × unter/über 25)', 'Kernbotschaft und Tagline, die über alle Ebenen konsistent bleibt', 'Starttermin und Counterprogramming gegen Konkurrenzfilme', 'Tracking-Baseline: Awareness, Interest, Definite Interest, First Choice', 'Testscreenings und Trailer-Tests vor dem Mediaeinkauf'],
      kpis: ['Tracking-Werte vs. Zielwerte', 'Testscreening-Score', 'Anteil „Definite Interest“ je Quadrant'],
      beispiele: ['Barbie und Oppenheimer starteten am selben Tag – aus dem Wettbewerbsfenster wurde „Barbenheimer“.', 'Top Gun: Maverick wurde mehrfach verschoben, um auf den Kinostart statt Streaming zu warten.'],
      risiko: 'Ohne klare Messlatte lässt sich später nicht erkennen, welche Ebene unterperformt.'
    },
    {
      id: 3, name: 'Pre-Awareness & Announcement', short: 'Announcement', phase: 'aufbau',
      funnel: ['Awareness'], zeit: 'T-12 bis T-6 Monate',
      kurz: 'Die ersten Signale: Casting-News, First-Look, Fan-Messen, Teaser-Poster.',
      warum: 'Frühe Berichte erreichen zuerst den Fan-Kern, der gezielt nach Neuigkeiten sucht. Diese Gruppe verbreitet Informationen unbezahlt weiter und liefert den ersten Social-Proof-Eindruck. Wiederholte frühe Kontakte erhöhen zudem die Vertrautheit (Mere-Exposure-Effekt), bevor das Paid-Media-Budget startet.',
      taktiken: ['Casting- und Regie-Meldungen in Fachpresse', 'First-Look-Foto als Exklusivstory', 'Panels auf Comic-Con, CinemaCon, D23', 'Teaser-Poster und Titel-Reveal', 'Exklusive Previews für Fan-Seiten und Podcasts'],
      kpis: ['Suchvolumen (Google Trends)', 'Erwähnungen in Social Media', 'Reichweite der Fan-Medien', 'Wachstum der Wishlist / Reminder'],
      beispiele: ['Barbie: Erstes Bild von Robbie im Barbie-Cabrio 2022 verbreitete sich ohne Media-Spend weltweit.'],
      risiko: 'Zu früh gezeigt, ohne Dranbleiben, verpufft die Aufmerksamkeit; zu spät, fehlt der Aufbau.'
    },
    {
      id: 4, name: 'Trailer & Creative Assets', short: 'Trailer', phase: 'verdichtung',
      funnel: ['Awareness', 'Interest', 'Intent'], zeit: 'T-6 Monate bis T-1 Woche',
      kurz: 'Das Konversionsprodukt: Teaser, Trailer, TV-Spots, Key Art, Clips, Featurettes.',
      warum: 'Der Trailer ist die einzige Ebene, auf der das Publikum das Produkt tatsächlich sieht. Er muss in 2 bis 2,5 Minuten Genre, Ton, Einsatz und einen „Wow-Moment“ vermitteln, ohne alles zu verraten (Curiosity Gap). Im Kino vor ähnlichen Filmen läuft er vor Menschen mit nachgewiesener Kaufbereitschaft. Die Qualität dieser Ebene hebelt alle bezahlten Ebenen, weil sie die Rate bestimmt, mit der Reichweite in Interesse umgesetzt wird.',
      taktiken: ['Teaser (Stimmung, Frage) → Trailer 1 (Prämisse) → Trailer 2/Final (Einsatz, Höhepunkte)', 'TV-Spots in 15/30 Sekunden, auf Zielgruppen zugeschnitten', 'Key Art/Poster als Wiedererkennung über alle Kanäle', 'Clips und Featurettes für Social/Late-Night', 'A/B-Tests und Trailer-Tests vor dem Mediaeinkauf'],
      kpis: ['Views in 24 Stunden', 'Completion Rate', 'Sentiment', 'Veränderung der Definite-Interest-Werte nach Trailer-Start'],
      beispiele: ['Cloverfield (2008): Teaser ohne Titel und ohne Monster löste monatelange Spekulation aus.', 'Barbie: Teaser parodierte „2001“ und kommunizierte Ton und Haltung sofort.'],
      risiko: 'Ein Trailer, der den falschen Ton trifft, lockt die falsche Zielgruppe und kostet über alle Ebenen Effizienz.'
    },
    {
      id: 5, name: 'Paid Media', short: 'Paid Media', phase: 'verdichtung',
      funnel: ['Awareness', 'Interest', 'Intent'], zeit: 'T-8 Wochen bis Release',
      kurz: 'TV, Digital, Social-Ads, Außenwerbung, Kinowerbung, Suche: gekaufte Reichweite × Frequenz.',
      warum: 'Awareness skaliert mit Reichweite, Überzeugung mit Wiederholung: Es braucht typischerweise mehrere Kontakte, damit Information ankommt und Absicht entsteht. Weil der Film nur wenige Tage „frisch“ ist, wird der Großteil des Budgets in den letzten zwei bis drei Wochen vor dem Start konzentriert, damit der Kaufimpuls (Recency) direkt vor dem Eröffnungswochenende am höchsten ist.',
      taktiken: ['Mediamix aus TV, Digital, Social, Außenwerbung, Kino, Suche', 'Heavy-up in den letzten 14–21 Tagen', 'Event-Platzierungen (großes Sport-Finale, Preisverleihungen)', 'Retargeting auf Trailer-Seher', 'Zielgruppen- und Regionen-Aussteuerung nach Tracking'],
      kpis: ['Reichweite und durchschn. Frequenz', 'CPM', 'Kosten je Punkt Definite Interest', 'Share of Voice gegenüber Konkurrenzfilmen'],
      beispiele: ['Große Studiotitel geben den Löwenanteil des Marketingbudgets für bezahlte Medien aus.'],
      risiko: 'Mehr Geld kann schwache Konversion (Trailer/Produkt) nicht dauerhaft ausgleichen, sondern nur schneller verbrennen.'
    },
    {
      id: 6, name: 'Owned, Social & Creator', short: 'Social', phase: 'verdichtung',
      funnel: ['Awareness', 'Interest', 'Advocacy'], zeit: 'T-12 Monate bis T+4 Wochen',
      kurz: 'Eigene Kanäle, Creator-Seeding, Memes, Challenges, Community.',
      warum: 'Auf sozialen Plattformen wirkt nicht nur Reichweite, sondern Zugehörigkeit: Menschen teilen, was ihre Identität ausdrückt. Nutzergenerierte Inhalte erzeugen Reichweite ohne Media-Kosten und wirken glaubwürdiger als Werbung (Social Proof). Gleichzeitig zeigt der Algorithmus Inhalte mit hoher Beteiligung weiter aus.',
      taktiken: ['Creator-Seeding mit Zielgruppen-Fit', 'Teilbare Vorlagen (Poster-Generatoren, Filter, Sounds)', 'Challenges und Meme-Formate', 'Community-Aufbau (Discord, Newsletter, Fanclubs)', 'Reaktives Community-Management'],
      kpis: ['Engagement-Rate', 'Anteil nutzergenerierter Inhalte', 'Hashtag-Volumen', 'Teilungsrate'],
      beispiele: ['Barbie: Poster-Generator („Ich bin ein Barbie“) erzeugte Millionen eigener Posts.', 'Deadpool: Hauptdarsteller selbst als Social-Kanal.'],
      risiko: 'Inszenierte Begeisterung wird schnell erkannt; Authentizität lässt sich nicht kaufen.'
    },
    {
      id: 7, name: 'Earned Media & PR', short: 'PR', phase: 'verdichtung',
      funnel: ['Interest', 'Intent'], zeit: 'T-8 Wochen bis T+2 Wochen',
      kurz: 'Pressetour, Talkshows, Premiere, Festival, Kritik, Awards-Narrativ.',
      warum: 'Dritte sagen glaubwürdiger, dass ein Film gut ist, als der Absender selbst. Bei Arthouse und Prestige-Titeln entscheidet Kritik direkt über Kaufabsicht; bei Blockbustern erzeugt PR das Gefühl, etwas Großes passiere gerade (Event-Status). Festivalpremieren liefern zusätzlich einen Qualitätsstempel und erste Mundpropaganda.',
      taktiken: ['Pressetour und Late-Night-Auftritte', 'Festival-Premiere (Cannes, Venedig, Toronto, SXSW)', 'Gestaffelte Kritikervorführungen und Review-Embargo', 'Rote-Teppich-Premiere als Bildmaterial', 'Awards-Positionierung für Prestige-Filme'],
      kpis: ['Share of Voice', 'Tier-1-Berichterstattung', 'Kritikerwertung (z. B. Rotten Tomatoes, Metacritic)', 'Sentiment der Berichterstattung'],
      beispiele: ['Everything Everywhere All at Once: SXSW-Premiere lieferte den Anschub für die Mundpropaganda.', 'Top Gun: Maverick: Cannes-Auftritt von Tom Cruise unterstrich den Kino-Event-Charakter.'],
      risiko: 'Schlechte Kritiken oder ein misslungenes Interview wirken genauso verstärkend wie gute.'
    },
    {
      id: 8, name: 'Partnerschaften, Merchandising & Lizenzen', short: 'Partner', phase: 'aufbau',
      funnel: ['Awareness', 'Interest'], zeit: 'T-6 Monate bis Release',
      kurz: 'Co-Promotion mit Marken, Merchandise, Games, Themenparks.',
      warum: 'Partnermarken bringen eigenes Mediabudget und eigene Kontaktpunkte mit. Dadurch begegnet das Publikum dem Film an Orten, an denen Studios selbst nicht werben könnten (Regal, Fast-Food-Tray, Schaufenster). Ubiquität erzeugt den Eindruck eines Kulturmoments; Merchandise ist zudem ein eigener Umsatzstrom.',
      taktiken: ['Co-Branding mit Konsum-, Mode- und Foodmarken', 'Produktlinien und Kollaborationen', 'Spiele/Apps zur Verlängerung der Aufmerksamkeit', 'Themenpark-Attraktionen', 'Handelsaktionen am Point of Sale'],
      kpis: ['Mediawert der Partner', 'Merchandise-Abverkauf', 'Reichweite der Aktionen', 'Anzahl aktiver Partner'],
      beispiele: ['Barbie: nach Branchenberichten weit über 100 Lizenz- und Marken-Partner weltweit.'],
      risiko: 'Zu viele unpassende Partner verwässern die Marke; Merchandise-Erfolg ohne Filmerfolg ist kein Selbstläufer.'
    },
    {
      id: 9, name: 'Experiential, Stunts & ARG', short: 'Experiential', phase: 'verdichtung',
      funnel: ['Awareness', 'Interest', 'Advocacy'], zeit: 'T-12 Monate bis T-1 Woche',
      kurz: 'Pop-ups, Guerilla, Fan-Screenings, Alternate-Reality-Games, begehbare Welten.',
      warum: 'Erlebnisse erzeugen Geschichten, die Menschen erzählen und fotografieren (Earned Reach pro Euro deutlich über Standardwerbung). Verknappung und Teilnahme erzeugen Dringlichkeit und Nähe zum Film, und die Berichterstattung über den Stunt verdoppelt die Reichweite.',
      taktiken: ['Pop-up-Welten (z. B. begehbares Set)', 'Fake-Dokumentation/Missing-Poster-Kampagne', 'ARG mit Rätseln über Wochen', 'Fan-Previews mit begrenzten Plätzen', 'Outdoor-Aktionen, die Social-Fotos provozieren'],
      kpis: ['Earned Reach pro Einsatz', 'Social-Volumen zur Aktion', 'Teilnehmerzahlen', 'Medienberichte'],
      beispiele: ['The Blair Witch Project (1999): Website, „Vermisst“-Plakate, Fake-Doku.', 'The Dark Knight (2008): „Why So Serious?“-ARG weltweit.', 'Barbie: begehbares Malibu-DreamHouse (Airbnb).'],
      risiko: 'Nur wirksam, wenn die Aktion zur Story passt und Berichterstattung auslöst; sonst reine Kosten.'
    },
    {
      id: 10, name: 'Distribution & Exhibition', short: 'Verleih', phase: 'release',
      funnel: ['Intent', 'Kauf'], zeit: 'T-6 Wochen bis Release',
      kurz: 'Kinoanzahl, Premium-Formate, Vorverkauf, Previews, Verleihkonditionen.',
      warum: 'Ohne Verfügbarkeit gibt es keinen Kauf. Vorverkäufe sind zugleich Absicht in Verpflichtung verwandelt und liefern öffentlich sichtbare Dynamik („ausverkauft“ wirkt als Social Proof). Premium-Formate (IMAX, Large Format, 3D) heben den Ticketpreis und sind Event-Signal. Kinoketten vergeben Säle nach erwarteter Nachfrage, die Marketing vorher belegen muss.',
      taktiken: ['Vorverkaufsstart mit Werbefenster', 'Previews/Thursday-Previews/Fan-Screenings', 'IMAX- und Premium-Large-Format-Sicherung', 'Verhandlung von Saalzahlen und Spielzeiten', 'Kino-Aufsteller, Lobby-Branding'],
      kpis: ['Vorverkauf vs. Vergleichstitel', 'Anzahl Leinwände', 'Anteil Premium-Formate', 'Durchschnitt pro Leinwand'],
      beispiele: ['Paranormal Activity: „Demand It“-System entschied über zusätzliche Kinostarts nach Nachfrage.', 'The Dark Knight: sechs Minuten IMAX-Prolog schon Monate vor Start.'],
      risiko: 'Zu viele Kinos bei zu wenig Nachfrage ergeben leere Säle und sinkende Folgewochenenden.'
    },
    {
      id: 11, name: 'Mundpropaganda & Nachwirkung', short: 'Mundpropaganda', phase: 'release',
      funnel: ['Kauf', 'Advocacy'], zeit: 'T+0 bis T+6 Monate',
      kurz: 'Publikumsbewertungen, zweites Wochenende, Awards, Heimkino, Streaming, Library.',
      warum: 'Die Eröffnung lässt sich kaufen, die Laufzeit nicht. Ob ein Film nach dem ersten Wochenende weiter Besucher gewinnt, entscheidet das Publikum: Gefällt der Film, empfehlen ihn Besucher weiter (stärkste Glaubwürdigkeit), und aus dem Eröffnungsumsatz wird ein Vielfaches. Danach verlängern Awards, Heimkino und Streaming den Verwertungsweg.',
      taktiken: ['Publikumswertungen in Spots zitieren', 'Zweitwochenende-Heavy-up, wenn Mundpropaganda stark ist', 'Awards-Kampagne bei Prestige-Titeln', 'Wiederaufführungen und Special Screenings', 'Digital-, Heimkino- und Streaming-Fenster timen'],
      kpis: ['Multiplikator (Gesamt ÷ Opening)', 'Rückgang am zweiten Wochenende', 'CinemaScore/Publikumsnote', 'Anteil Mehrfachbesucher'],
      beispiele: ['Top Gun: Maverick: Inlands-Multiplikator um das 5,7-Fache.', 'Everything Everywhere All at Once: wuchs über Wochen mit Mundpropaganda und Oscars.'],
      risiko: 'Hohe Eröffnung bei schlechter Mundpropaganda bricht im zweiten Wochenende ein („frontloaded“).'
    }
  ];

  /* Anteil am P&A-Budget je Filmtyp (Summe je Typ = 100). Ebene 1 liegt im Produktionsbudget. */
  const ARCHETYPES = {
    event: {
      name: 'Franchise / Event-Film', desc: 'Starke IP, große Eröffnung, weltweit',
      opening: 0.38, conv: 0.30, diRate: 0.15, freq: 8, cpm: 20,
      shares: [0, 3, 4, 14, 52, 6, 6, 2, 4, 4, 5]
    },
    original: {
      name: 'Original-Blockbuster', desc: 'Keine Vorlage, Konzept und Besetzung müssen tragen',
      opening: 0.28, conv: 0.25, diRate: 0.10, freq: 8, cpm: 20,
      shares: [0, 4, 4, 15, 46, 7, 8, 2, 5, 4, 5]
    },
    horror: {
      name: 'Horror / Low-Budget-Hit', desc: 'Günstig, frontloaded, viral',
      opening: 0.45, conv: 0.30, diRate: 0.12, freq: 6, cpm: 18,
      shares: [0, 3, 3, 14, 38, 12, 8, 1, 12, 4, 5]
    },
    family: {
      name: 'Familie / Animation', desc: 'Eltern entscheiden; Ferien und Feiertage zählen',
      opening: 0.25, conv: 0.30, diRate: 0.14, freq: 7, cpm: 18,
      shares: [0, 3, 3, 13, 48, 6, 6, 8, 3, 5, 5]
    },
    arthouse: {
      name: 'Arthouse / Prestige-Drama', desc: 'Kritik, Festivals und Mundpropaganda tragen',
      opening: 0.12, conv: 0.20, diRate: 0.06, freq: 5, cpm: 15,
      shares: [0, 3, 3, 10, 22, 10, 22, 0, 6, 4, 20]
    }
  };

  /* Zeitleiste: Offset in Tagen zum Start (negativ = davor). */
  const MILESTONES = [
    { d: -1095, t: 'Idee, IP-Rechte, erste Skriptfassung', txt: 'Hier liegt der Ursprung: Konzept und Marktlücke werden geprüft.', levels: [1] },
    { d: -730, t: 'Greenlight: Besetzung, Regie, Altersfreigabe', txt: 'Entscheidung über Marketingtauglichkeit des Pakets.', levels: [1] },
    { d: -540, t: 'Marketingplan, Zielgruppentests, Partnergespräche', txt: 'Baseline messen und Messlatte festlegen.', levels: [2, 8] },
    { d: -365, t: 'Starttermin öffentlich, Strategie finalisiert', txt: 'Tracking-Baseline startet; Wettbewerbsumfeld ist fixiert.', levels: [2] },
    { d: -270, t: 'Fan-Messe-Präsentation und First Look', txt: 'Der Fan-Kern wird aktiviert und verbreitet unbezahlt.', levels: [3, 6] },
    { d: -150, t: 'Teaser-Trailer', txt: 'Ton und Frage setzen, ohne zu viel zu zeigen.', levels: [4, 3, 6] },
    { d: -90, t: 'Teaser-Poster, Partner-Launch, Creator-Seeding', txt: 'Aufmerksamkeit wird auf mehreren Ebenen gleichzeitig aufgebaut.', levels: [3, 8, 6, 9] },
    { d: -42, t: 'Haupttrailer und Event-Spot', txt: 'Erste große Reichweitenwelle; Kaufabsicht wird sichtbar messbar.', levels: [4, 5] },
    { d: -28, t: 'Tracking-Check: Ziel vs. Ist', txt: 'Mediaplan nachjustieren, Botschaften schärfen.', levels: [2, 5] },
    { d: -14, t: 'Vorverkauf offen, Final-Trailer, TV-Heavy-up', txt: 'Absicht wird in Verpflichtung umgewandelt; maximale Frequenz.', levels: [10, 4, 5] },
    { d: -7, t: 'Review-Embargo fällt, Pressetour auf Höhepunkt', txt: 'Dritte bestätigen (oder widerlegen) das Versprechen.', levels: [7] },
    { d: -2, t: 'Premiere, Fan-Screenings, Thursday-Previews', txt: 'Event-Gefühl und erste Mundpropaganda.', levels: [9, 10, 7] },
    { d: 0, t: 'Eröffnungswochenende', txt: 'Hier zeigt sich, was Ebenen 1–10 zusammen bewirkt haben.', levels: [5, 10], key: true },
    { d: 14, t: 'Zweites Wochenende: Drop-Analyse', txt: 'Der Rückgang zeigt, ob Mundpropaganda trägt. Spots mit Publikumsnoten nachziehen.', levels: [11, 5], key: true },
    { d: 90, t: 'Digital-Release und Awards-Kampagne', txt: 'Zweite Verwertungswelle und Prestige-Narrativ.', levels: [11] },
    { d: 180, t: 'Heimkino/Streaming und Library-Wert', txt: 'Langfristiger Wert der Marke und des Titels.', levels: [11, 8] }
  ];

  /* Fallstudien. lv = Intensität je Ebene 1–11 (0–3). */
  const CASES = [
    {
      id: 'barbie', title: 'Barbie', year: 2023, type: 'Event-Film aus Marken-IP',
      zahlen: { budget: 'ca. 145 Mio. $', marketing: 'laut Berichten ca. 150 Mio. $', einspiel: 'ca. 1,44 Mrd. $ weltweit' },
      lv: [3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 3],
      kette: [
        ['Ergebnis', 'Rund 1,4 Mrd. $ weltweit, erfolgreichster Film des Jahres 2023; das Eröffnungswochenende überstieg alle Erwartungen.'],
        ['Laufzeit', 'Starke Mundpropaganda und Wiederholungsbesuche (Verkleidung als Teil des Kinobesuchs) verlängerten die Laufzeit.'],
        ['Verdichtung', 'Kampagne in Pink überall: Außenwerbung, Poster-Generator, Teaser im Stil von „2001“, Dutzende Partner-Produkte.'],
        ['Aufbau', 'Erstes Bild von Margot Robbie im Barbie-Cabrio (2022) ging ohne Media-Spend um die Welt.'],
        ['Ursprung', 'Marke seit 1959 mit globaler Bekanntheit; Regisseurin und Besetzung gaben dem Projekt Kultur- und Qualitätsstatus.']
      ],
      lehre: 'Alle Ebenen wirkten wie ein System: Die Kampagne war selbst das Ereignis. Der gleiche Starttermin wie Oppenheimer machte aus Konkurrenz eine gemeinsame Kulturwelle (Barbenheimer), die beiden Filmen nützte.'
    },
    {
      id: 'blair', title: 'The Blair Witch Project', year: 1999, type: 'Low-Budget-Horror',
      zahlen: { budget: 'ca. 60.000 $ (Rohbudget)', marketing: 'zunächst minimal; später Vertriebsbudget', einspiel: 'ca. 248 Mio. $ weltweit' },
      lv: [3, 2, 2, 1, 1, 2, 2, 0, 3, 1, 3],
      kette: [
        ['Ergebnis', 'Rund 248 Mio. $ weltweit bei einem Rohbudget im fünfstelligen Bereich, eines der profitabelsten Verhältnisse der Filmgeschichte.'],
        ['Laufzeit', 'Mundpropaganda („Ist das echt?“) trieb Besucher in die Kinos, nachdem der Film in begrenzten Häusern anlief.'],
        ['Verdichtung', 'Fake-Dokumentation im Fernsehen, „Vermisst“-Plakate und frühe Website ließen den Film wie echte Aufnahmen wirken.'],
        ['Aufbau', 'Festivalpremiere (Sundance) schuf Branchenbuzz und Verkauf an einen Verleih.'],
        ['Ursprung', 'Found-Footage-Konzept, bei dem die Illusion der Echtheit selbst das Marketing war.']
      ],
      lehre: 'Das Produkt war die Kampagne. Neuheit, Rätsel und Teilnahme ersetzten Mediabudget, das heute nicht mehr mit dem gleichen Neuheitseffekt funktioniert.'
    },
    {
      id: 'darkknight', title: 'The Dark Knight', year: 2008, type: 'Event-Film / Sequel',
      zahlen: { budget: 'ca. 185 Mio. $', marketing: 'nicht einheitlich berichtet', einspiel: 'ca. 1,0 Mrd. $ weltweit' },
      lv: [3, 3, 2, 3, 3, 2, 2, 2, 3, 3, 2],
      kette: [
        ['Ergebnis', 'Rund 1 Mrd. $ weltweit; Rekord-Eröffnung zum Start.'],
        ['Verdichtung', 'Virales ARG „Why So Serious?“ ließ Fans weltweit Rätsel lösen und Orte aufsuchen; Joker-Bilder wurden zum Kultursymbol.'],
        ['Aufbau', 'Sechs Minuten IMAX-Prolog liefen Monate vor Start im Kino und machten das Format zum Kaufgrund.'],
        ['Ursprung', 'Nolans Batman Begins hatte Vertrauen geschaffen; die Fortsetzung versprach Steigerung, nicht Wiederholung.']
      ],
      lehre: 'Fans zu Mitspielern zu machen schafft Reichweite, die kein Media-Einkauf liefert. Premium-Format als Kaufgrund hebt zusätzlich den Durchschnittsticketpreis.'
    },
    {
      id: 'deadpool', title: 'Deadpool', year: 2016, type: 'R-Rated-Comic-Verfilmung',
      zahlen: { budget: 'ca. 58 Mio. $', marketing: 'im Verhältnis zum Einspiel auffallend günstig', einspiel: 'ca. 782 Mio. $ weltweit' },
      lv: [3, 2, 3, 3, 2, 3, 2, 1, 3, 1, 2],
      kette: [
        ['Ergebnis', 'Rund 782 Mio. $ weltweit; erfolgreichster R-Rated-Film seiner Zeit.'],
        ['Verdichtung', 'Humorvolle Außenwerbung (Emoji-Plakate, Parodien auf Feiertage) verwandelte Werbeflächen in Pointen.'],
        ['Aufbau', 'Der Hauptdarsteller selbst machte Social Media zum Kampagnenkanal.'],
        ['Ursprung', 'Geleaktes Testmaterial 2014 löste Fan-Begeisterung aus und half, das Studio zum Greenlight zu bewegen.']
      ],
      lehre: 'Ton und Haltung der Kampagne entsprachen dem Produkt vollständig. Der Fan-Beweis (Leak, Begeisterung) wurde zum Argument im Studio – Marketing wirkte schon vor der Produktion.'
    },
    {
      id: 'paranormal', title: 'Paranormal Activity', year: 2009, type: 'Low-Budget-Horror',
      zahlen: { budget: 'ca. 15.000 $ (Rohbudget)', marketing: 'Verleih investierte später in Nachdreh und Start', einspiel: 'ca. 193 Mio. $ weltweit' },
      lv: [2, 2, 1, 2, 1, 2, 2, 0, 3, 3, 3],
      kette: [
        ['Ergebnis', 'Rund 193 Mio. $ weltweit, eines der besten Kosten-Einspiel-Verhältnisse der Geschichte.'],
        ['Verdichtung', 'Aufnahmen von Zuschauerreaktionen (Trailer zeigt Publikum, nicht den Film) erzeugten Social Proof.'],
        ['Aufbau', '„Demand It“: Kinos bekamen den Film erst nach genügend Online-Nachfrage, das erzeugte Verknappung und Dringlichkeit.'],
        ['Ursprung', 'Heimvideo-Horror mit minimalem Budget; ein Verleih kaufte Rechte und schnitt das Ende neu.']
      ],
      lehre: 'Der Vertrieb war die Marketingidee: Wer den Film sehen will, muss ihn „herbeiwählen“. Das verwandelt Nachfrage in sichtbares Gemeinschaftsprojekt.'
    },
    {
      id: 'topgun', title: 'Top Gun: Maverick', year: 2022, type: 'Legacy-Sequel',
      zahlen: { budget: 'ca. 170 Mio. $', marketing: 'nicht einheitlich berichtet', einspiel: 'ca. 1,49 Mrd. $ weltweit' },
      lv: [3, 3, 2, 3, 3, 1, 3, 2, 2, 3, 3],
      kette: [
        ['Ergebnis', 'Rund 1,49 Mrd. $ weltweit; Inlands-Multiplikator um das 5,7-Fache, ungewöhnlich hoch für einen Blockbuster.'],
        ['Laufzeit', 'Überragende Publikumsnoten und Wiederholungsbesuche, vor allem in Premium-Formaten.'],
        ['Verdichtung', 'Cruise-Pressetour, Cannes-Auftritt, echte Flugaufnahmen als zentrales Versprechen („im Kino erleben“).'],
        ['Aufbau', 'Mehrmalige Verschiebung (Pandemie): Studio lehnte Streaming ab und hielt den Kinostart durch.'],
        ['Ursprung', 'Nostalgie-IP von 1986, Hauptdarsteller als Garant für „großes Kino“.']
      ],
      lehre: 'Das Marketing versprach ein Kino-Erlebnis, das sich zu Hause nicht ersetzen lässt – und der Film hielt das Versprechen. Das ist die Voraussetzung für einen hohen Multiplikator.'
    },
    {
      id: 'eeaao', title: 'Everything Everywhere All at Once', year: 2022, type: 'Arthouse mit Crossover',
      zahlen: { budget: 'ca. 25 Mio. $', marketing: 'vergleichsweise gering', einspiel: 'ca. 140 Mio. $ weltweit' },
      lv: [3, 2, 1, 2, 1, 2, 3, 0, 2, 2, 3],
      kette: [
        ['Ergebnis', 'Rund 140 Mio. $ weltweit und sieben Oscars, bester Film des Verleihs A24 kommerziell.'],
        ['Laufzeit', 'Begrenzter Start, dann schrittweise Ausweitung, solange die Nachfrage wuchs.'],
        ['Verdichtung', 'Festivalpremiere (SXSW) und begeisterte Kritiken, dazu Online-Fandom und Memes.'],
        ['Ursprung', 'Originelle, schwer zu beschreibende Prämisse, die aber emotional zugänglich war.']
      ],
      lehre: 'Bei Arthouse zählt Seeding bei Multiplikatoren und Ausweitung nach Nachfrage mehr als große Eröffnung.'
    },
    {
      id: 'johncarter', title: 'John Carter', year: 2012, type: 'Gegenbeispiel: teuer, aber unklar',
      zahlen: { budget: 'ca. 250 Mio. $', marketing: 'laut Berichten ca. 100 Mio. $', einspiel: 'ca. 284 Mio. $ weltweit' },
      lv: [1, 1, 1, 2, 3, 1, 2, 1, 1, 2, 0],
      kette: [
        ['Ergebnis', 'Rund 284 Mio. $ weltweit bei ca. 250 Mio. $ Budget; das Studio meldete eine Abschreibung von rund 200 Mio. $.'],
        ['Laufzeit', 'Schwache Mundpropaganda; der Rückgang nach dem Start war steil.'],
        ['Verdichtung', 'Hohes Paid-Media-Volumen, aber unklare Botschaft; Trailer vermittelte nicht, was der Film ist.'],
        ['Ursprung', 'Alter Stoff ohne heutige Bekanntheit; Titel wurde im Marketing auf „John Carter“ gekürzt und verlor seine Genre-Signalwirkung.']
      ],
      lehre: 'Reichweite ohne klare Positionierung verbrennt Geld. Wo Ebene 1 und 2 (Konzept, Positionierung) schwach sind, kann Ebene 5 allein nicht retten.'
    }
  ];

  /* Warum Marketing wirkt */
  const PRINZIPIEN = [
    { t: 'Erfahrungsgut mit hohem Risiko', txt: 'Man kann einen Film erst nach dem Kauf beurteilen. Marketing liefert Ersatzsignale (Besetzung, Trailer, Kritik, andere Besucher), die das wahrgenommene Risiko senken.', levels: [1, 4, 7, 11] },
    { t: 'Verderbliches Produkt, frontloaded Nachfrage', txt: 'Ein großer Teil des Umsatzes fällt in die ersten Tage. Deshalb wird die gesamte Aufmerksamkeit auf ein Wochenende konzentriert: „Event-isierung“ statt gleichmäßiger Werbung.', levels: [5, 9, 10] },
    { t: 'Wiederholung erzeugt Vertrautheit', txt: 'Mehrfachkontakte erhöhen Wiedererkennung und Sympathie (Mere-Exposure-Effekt). Wichtig ist die richtige Frequenz kurz vor dem Kauf (Recency).', levels: [3, 5] },
    { t: 'Social Proof und FOMO', txt: 'Menschen orientieren sich an anderen: Warteschlangen, ausverkaufte Vorstellungen, Hashtags. Die Angst, ein Gesprächsthema zu verpassen, treibt Kinobesuche an.', levels: [6, 10, 11] },
    { t: 'Curiosity Gap', txt: 'Teaser zeigen genug, um Interesse zu wecken, aber nicht genug, um die Neugier zu stillen. Die Lücke bringt ins Kino.', levels: [4, 9] },
    { t: 'Identität und Zugehörigkeit', txt: 'Ein Kinobesuch ist ein soziales Ritual. Wer in Pink ins Kino geht, zeigt Zugehörigkeit. Marketing, das Identifikation anbietet, wird geteilt.', levels: [6, 8, 9] },
    { t: 'Geliehene Glaubwürdigkeit', txt: 'Kritiker, Festivals, Freunde und Creator wirken glaubwürdiger als Werbung. Jede Quelle löst einen anderen Zweifel.', levels: [7, 6, 11] },
    { t: 'Ebenen verstärken sich (Cross-Channel-Effekt)', txt: 'Ein Kontakt auf mehreren Ebenen wirkt stärker als der gleiche Kontakt mehrfach auf einer Ebene: Trailer erzeugt Interesse, Kritik bestätigt, Vorverkauf bindet, Mundpropaganda trägt weiter.', levels: [4, 5, 6, 7, 10, 11] },
    { t: 'Konversionsraten multiplizieren sich', txt: 'Aus Bekanntheit, Interesse, Absicht und Kauf ergibt sich das Ergebnis als Produkt der Stufen. Ist eine Stufe schwach, bricht das Gesamtergebnis ein, egal wie stark die anderen sind.', levels: [2, 4, 5] }
  ];

  /* Barrieren: warum jemand NICHT ins Kino geht, und welche Ebene sie löst. */
  const BARRIEREN = [
    { b: '„Kenne ich nicht.“', f: 'Awareness', fix: [3, 5, 6, 8], txt: 'Reichweite durch Announcement, Paid Media, Social und Partner.' },
    { b: '„Ist nichts für mich.“', f: 'Interest', fix: [1, 2, 4, 6], txt: 'Relevanz durch Konzept, Positionierung, Trailer und passende Creator.' },
    { b: '„Lohnt sich das?“', f: 'Intent', fix: [4, 7, 11], txt: 'Vertrauen durch Kritik, Wertungen und Mundpropaganda.' },
    { b: '„Kann ich auch später streamen.“', f: 'Kauf', fix: [9, 10], txt: 'Dringlichkeit durch Event-Charakter, Premium-Formate, Vorverkauf.' },
    { b: '„War es gut?“', f: 'Advocacy', fix: [11, 6], txt: 'Bestätigung und Empfehlung nach dem Besuch.' }
  ];

  return { FUNNEL, PHASES, LEVELS, ARCHETYPES, MILESTONES, CASES, PRINZIPIEN, BARRIEREN };
})();
