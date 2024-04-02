# Changelog

## v1.0.1

Neu:

- @param {string} options.reset - Der Selektor für die Schaltfläche zum Löschen aller Zeile.
- $(document).clonebox("reset") - Die Methode zum Löschen aller Zeilen.
  <br>
  <br>

## v1.0.0

Initial release:

- @param {number} options.limit - Die maximale Anzahl von Zeilen, die hinzugefügt werden können.
- @param {string} options.row - Der Selektor / Wrapper für die zu Klonenden-Element.
- @param {string} options.add - Der Selektor für die Schaltfläche zum Hinzufügen einer Zeile.
- @param {string} options.del - Der Selektor für die Schaltfläche zum Löschen einer Zeile.
- @param {string} options.invalid - Die CSS-Klasse für den ungültigen Zustand von Eingabefeldern.
- @param {string} options.valid - Die CSS-Klasse für den gültigen Zustand von Eingabefeldern.
- @param {string} options.disabled - Die CSS-Klasse für das (de)aktivieren von dem Add-Button.
  <br>
  <br>
- Setzen der Attribute wie 'id' und 'name' für die Eingabefelder und 'for' für Label in den Zeilen.
