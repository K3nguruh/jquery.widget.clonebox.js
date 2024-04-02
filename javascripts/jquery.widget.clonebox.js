/**
 * Widget:  jquery.widget.clonebox.js
 *
 * Ein jQuery-Widget zur Verwaltung von klonbaren Elementen in einem HTML-Formular.
 * Es ermöglicht das Hinzufügen und Entfernen von Zeilen mit Eingabefeldern durch Klonen und Löschen.
 * Diese Zeilen können verwendet werden, um wiederholte Eingaben oder Daten in einem Formular zu verwalten.
 *
 * Autor:   K3nguruh <https://github.com/K3nguruh>
 * Version: 1.0.1
 * Datum:   2024-04-02 20:32
 * Lizenz:  MIT-Lizenz
 */

(function ($) {
  /**
   * Das Widget unterstützt die Konfiguration über Datenattribute sowie die Festlegung von maximalen
   * Anzahl von Zeilen und CSS-Klassen zur Visualisierung des gültigen und ungültigen Zustands von Eingabefeldern.
   *
   * @constructor
   * @param {object} options - Die Konfigurationsoptionen für das Widget.
   * @param {number} options.limit - Die maximale Anzahl von Zeilen, die hinzugefügt werden können.
   * @param {string} options.row - Der Selektor für das Klon-Element.
   * @param {string} options.add - Der Selektor für die Schaltfläche zum Hinzufügen einer Zeile.
   * @param {string} options.del - Der Selektor für die Schaltfläche zum Löschen einer Zeile.
   * @param {string} options.reset - Der Selektor für die Schaltfläche zum Löschen aller Zeile.
   * @param {string} options.invalid - Die CSS-Klasse für den ungültigen Zustand von Eingabefeldern.
   * @param {string} options.valid - Die CSS-Klasse für den gültigen Zustand von Eingabefeldern.
   * @param {string} options.disabled - Die CSS-Klasse für das (de)aktivieren von dem Add-Button.
   */
  $.widget("custom.clonebox", {
    options: {
      limit: Number.MAX_SAFE_INTEGER, // 9007199254740991

      row: '[data-clone="row"]',
      add: '[data-clone-btn="add"]',
      del: '[data-clone-btn="del"]',
      reset: '[data-clone-btn="reset"]',

      invalid: "is-invalid",
      valid: "is-valid",
      disabled: "disabled",
    },

    /**
     * Initialisiert das Widget und setzt die Optionen basierend auf den Datenattributen des Elements.
     *
     * Dies ist die erste Methode, die beim Erstellen des Widgets aufgerufen wird. Sie erweitert die Standardoptionen des Widgets
     * mit den Datenattributen des zugrunde liegenden HTML-Elements, um eine flexible Konfiguration zu ermöglichen.
     * Anschließend werden die Methoden zur Initialisierung der Klonbox und der Event-Handler aufgerufen.
     */
    _create: function () {
      this.options = $.extend(true, {}, this.options, this.element.data());

      this._initWidget();
      this._initEvents();
    },

    /**
     * Setzt den Zustand der Klonbox basierend auf der Anzahl der vorhandenen Zeilen und dem maximalen Limit.
     *
     * Diese Methode wird verwendet, um die Schaltflächen zum Hinzufügen und Löschen von Zeilen zu aktivieren oder zu deaktivieren,
     * je nachdem, ob das maximale Limit erreicht ist oder nicht.
     */
    _initWidget: function () {
      const $allRows = this.element.find(this.options.row);
      const boolean = $allRows.length >= this.options.limit;

      $allRows.find(this.options.add).toggleClass(this.options.disabled, boolean).prop("disabled", boolean);
      $allRows.find(this.options.add).not(":last").addClass(this.options.disabled).prop("disabled", true);

      this._setAttributes();
    },

    /**
     * Weist Event-Handler den Schaltflächen zum Hinzufügen und Löschen von Zeilen zu.
     *
     * Hier werden die Event-Handler für das Klicken auf die Schaltflächen zum Hinzufügen und Löschen von Zeilen festgelegt.
     * Dies ermöglicht es, dass die entsprechenden Funktionen ausgeführt werden, wenn Benutzer auf diese Schaltflächen klicken.
     */
    _initEvents: function () {
      this._on(this.element, { ["click " + this.options.add]: this._onClickAdd });
      this._on(this.element, { ["click " + this.options.del]: this._onClickDel });
      this._on(this.element, { ["click " + this.options.reset]: this._onClickReset });
    },

    /**
     * Fügt eine neue Zeile hinzu, indem die letzte Zeile geklont wird.
     *
     * @param {Event} event Das Klick-Ereignis der Schaltfläche.
     *
     * Diese Methode wird ausgeführt, wenn auf die Schaltfläche zum Hinzufügen einer Zeile geklickt wird. Sie klonen die letzte
     * Zeile der Klon-Box und fügen sie hinzu, falls das maximale Limit noch nicht erreicht ist. Nach dem Hinzufügen der Zeile
     * werden die Werte der Eingabefelder gelöscht und der Zustand der Klonbox neu gesetzt.
     */
    _onClickAdd: function (event) {
      event.preventDefault();

      const $allRows = this.element.find(this.options.row);
      const $lastRow = $allRows.last();

      if ($allRows.length >= this.options.limit) return;

      const $cloneRow = $lastRow.clone(true);

      $lastRow.after($cloneRow);

      this._resetInputs($cloneRow);
      this._initWidget();
    },

    /**
     * Entfernt die Zeile, zu der die Schaltfläche gehört, wenn mehr als eine Zeile vorhanden ist.
     *
     * @param {Event} event Das Klick-Ereignis der Schaltfläche.
     *
     * Wird ausgeführt, wenn auf die Schaltfläche zum Löschen einer Zeile geklickt wird. Sie entfernt die entsprechende Zeile,
     * falls mehr als eine Zeile vorhanden ist. Nach dem Entfernen der Zeile werden die Werte der Eingabefelder gelöscht und
     * der Zustand der Klonbox neu gesetzt.
     */
    _onClickDel: function (event) {
      event.preventDefault();

      const $allRows = this.element.find(this.options.row);
      const $thisRow = $(event.currentTarget).closest(this.options.row);

      if ($allRows.length > 1) {
        this._removeRows($thisRow);
      }

      this._resetInputs($thisRow);
      this._initWidget();
    },

    /**
     * Entfernt alle Zeilen, die über die erste Zeile hinausgehen.
     *
     * @param {Event} event Das Klick-Ereignis der Schaltfläche.
     *
     * Diese Methode wird verwendet, um alle Zeilen außer der ersten zu entfernen.
     * Sie sorgt dafür, dass alle zusätzlichen Zeilen gelöscht werden, um das Formular in den Ausgangszustand zu versetzen.
     */
    _onClickReset: function (event) {
      if (event) event.preventDefault();

      const $allRows = this.element.find(this.options.row);
      const $firstRow = $allRows.first();
      const $delRows = $allRows.not($firstRow);

      this._removeRows($delRows);
      this._resetInputs($firstRow);
      this._initWidget();
    },

    /**
     * Entfernt eine oder mehrere Zeile aus dem Formular.
     *
     * @param {jQuery} row Die zu entfernende Zeile(n).
     *
     * Diese Methode wird verwendet, um eine oder mehrere Zeile aus dem Formular zu entfernen.
     * Sie wird normalerweise aufgerufen, wenn der Benutzer auf die Schaltfläche zum Löschen einer Zeile klickt.
     */
    _removeRows: function (row) {
      $(row).remove();
    },

    /**
     * Löscht die Werte der Eingabefelder / Klassen in einer bestimmten Zeile.
     *
     * @param {jQuery} row Die Zeile, aus der die Werte gelöscht werden sollen.
     *
     * Diese Methode wird verwendet, um die Werte der Eingabefelder in einer bestimmten Zeile zu löschen.
     * Sie stellt sicher, dass beim Hinzufügen oder Löschen von Zeilen die Eingabefelder zurückgesetzt werden,
     * um eine konsistente Benutzererfahrung zu gewährleisten.
     */
    _resetInputs: function (row) {
      const $inputs = $(row).find(":input");

      $inputs.filter(":radio, :checkbox").prop("checked", false);
      $inputs.filter(":not(:button, :radio, :checkbox)").val("");
      $inputs.removeClass([this.options.invalid, this.options.valid]);
    },

    /**
     * Setzt die Attribute wie 'id' und 'name' für die Eingabefelder und 'for' für Label in den Zeilen.
     *
     * Diese Methode durchläuft alle Zeilen und passt die Attribute wie 'id' und 'name' der Eingabefelder und 'for' für Labels an,
     * um sicherzustellen, dass sie eindeutig sind und korrekt mit dem Formular interagieren können.
     * Sie wird verwendet, um die Konsistenz und Funktionalität der Eingabefelder in den geklonten Zeilen sicherzustellen.
     */
    _setAttributes: function () {
      const $allRows = this.element.find(this.options.row);

      $allRows.each(function (idx) {
        // Für jede Zeile
        $(this)
          .find(":input[name], label[for]")
          .each(function (_, elem) {
            const label = $(elem).attr("for");
            const name = $(elem).attr("name");

            // label
            if (label) {
              const match = label.match(/^([-_a-zA-Z]+)(?:-\d*)?$/);

              if (match) {
                const namePrefix = match[1];

                $(elem).attr("for", `${namePrefix}-${idx}`);
              }
            }

            // name / id
            if (name) {
              const match = name.match(/^([-_a-zA-Z]+)(?:\[\d*\])?$/);

              if (match) {
                const namePrefix = match[1];

                $(elem).attr({
                  id: `${namePrefix}-${idx}`,
                  name: `${namePrefix}[${idx}]`,
                });
              }
            }
          });
      });
    },

    /**
     * Setzt das Widget zurück, indem alle Zeilen außer der ersten entfernt werden.
     * Die Werte der ersten Zeile werden zurückgesetzt.
     *
     * Diese Methode wird von ausserhalb aufgerufen. Sie entfernt alle Zeilen außer der ersten und
     * setzt die Werte der Eingabefelder zurück, um das Formular in den Ausgangszustand zu versetzen.
     */
    reset: function () {
      this._onClickReset(null);
    },
  });

  //
  // Initialisiert das Widget für alle Elemente mit dem Datenattribut "data-plugin='clonebox'"
  $(function () {
    $('[data-plugin="clonebox"]').clonebox();
  });
})(jQuery);
