$(function(){

  // FUNKCJE POMOCNICZE
  function initSortable() {
    $('.kanban-column__list').sortable({
        connectWith: '.kanban-column__list',
        placeholder: 'kanban-card__placeholder'
    }).disableSelection();
  }

  function randomString() {
    var chars = '0123456789abcdefghiklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXTZ'.split
    var str = '', i;
    for (i = 0; i < 10; i++) {
        str += chars[Math.floor(Math.random() * chars.length)];
    }
    return str;
  }

  // KLASA KANBAN COLUMN
  function KanbanColumn(name) {
    var self = this;

    this.id = randomString();
    this.name = name || 'Add name';
    this.element = createColumnElement();

    function createColumnElement() {
      // TWORZENIE NOWYCH WĘZŁÓW
      var columnElement = $('<div class="kanban-column"></div>');
      var columnTitleElement = $('<h2 class="kanban-column__title">' + self.name.toUpperCase() + '</h2>');
      var columnListElement = $('<ul class="kanban-column__list"></ul>');
      var columnDeleteElement = $('<button class="kanban-column__delete">x</button>');
      var columnAddCardElement = $('<a class="kanban-column__add-card">Add card</a>');

      // PODPINANIE ODPOWIEDNICH ZDARZEŃ POD WĘZŁY
      columnDeleteElement.click(function() {
        self.removeColumn();
      });
      columnAddCardElement.click(function(event) {
        event.preventDefault();
        self.addCard(new KanbanCard('description', 'white'));
      });

      // KONSTRUOWANIE ELEMENTU KOLUMNY
      columnElement.append(columnTitleElement)
        .append(columnDeleteElement)
        .append(columnAddCardElement)
        .append(columnListElement);
      return columnElement;
    }
  }
  KanbanColumn.prototype = {
    addCard: function(card) {
      this.element.children('ul').append(card.element);
    },
    removeColumn: function() {
      this.element.remove();
    }
  };

  // KLASA KANBAN CARD
  function KanbanCard(description, color) {
    var self = this;

    this.id = randomString();
    this.description = description || 'proman';
    this.color = color || 'white';
    this.element = createCardElement();

    function createCardElement() {
      var kanbanCard = $('<li class=kanban-card></li>');
      var kanbanCardButton = $('<button class="kanban-card__delete">x</button>');
      var kanbanCardDescription = $('<p class="kanban-card__description"></p>');
      kanbanCard.addClass('kanban-card--' + self.color);
      kanbanCardButton.click(function(){
        self.removeCard();
      });
      kanbanCard.append(kanbanCardButton);
      kanbanCardDescription.text(self.description);
      kanbanCard.append(kanbanCardDescription)
      return kanbanCard;
    }
  }
  KanbanCard.prototype = {
    removeCard: function() {
      this.element.remove();
    }
  }

  // KANBAN TABLE OBJECT
  var kanbanTable = {
    name: 'Tablica Kanban',
    addColumn: function(column) {
      this.element.append(column.element);
      initSortable();
    },
    element: $('#kanban-table .kanban-table__container')
  };
  $('.kanban-table__new-column')
    .click(function(){
      kanbanTable.addColumn(new KanbanColumn());
    });

  // TWORZENIE NOWYCH EGZEMPLARZY KOLUMN
  var coll1 = new KanbanColumn('Add name');
  var coll2 = new KanbanColumn('Add name');
  var coll3 = new KanbanColumn('Add name');

  // DODAWANIE KOLUMN DO TABLICY
  kanbanTable.addColumn(coll1);
  kanbanTable.addColumn(coll2);
  kanbanTable.addColumn(coll3);

  // TWORZENIE NOWYCH EGZEMPLARZY KART
  var card1 = new KanbanCard();
  var card2 = new KanbanCard();
  var card3 = new KanbanCard('!@#@$%^#@ tablice', 'green');
  var card4 = new KanbanCard('wcale nie random data', 'blue');

  // DODAWANIE KART DO KOLUMN
  coll1.addCard(card1);
  coll2.addCard(card2);
  coll3.addCard(card3);
  coll3.addCard(card4);
})
