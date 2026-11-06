sap.ui.define(
  [
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/m/Dialog",
    "sap/m/Text",
    "sap/m/Button",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/Fragment",
    "../model/formatter",
  ],
  (
    BaseController,
    JSONModel,
    MessageToast,
    Dialog,
    Text,
    Button,
    Filter,
    FilterOperator,
    Fragment,
    formatter,
  ) => {
    "use strict";

    return BaseController.extend("project1.controller.JSON", {
      onInit() {
        const oData = {
          books: [
            {
              ID: "1",
              Name: "1984",
              Author: "George Orwell",
              Genre: "Dystopian",
              ReleaseDate: new Date(1949, 5, 8),
              AvailableQuantity: 12,
              editMode: false,
            },
            {
              ID: "2",
              Name: "To Kill a Mockingbird",
              Author: "Harper Lee",
              Genre: "Classic",
              ReleaseDate: new Date(1960, 6, 11),
              AvailableQuantity: 7,
              editMode: false,
            },
            {
              ID: "3",
              Name: "The Hobbit",
              Author: "J.R.R. Tolkien",
              Genre: "Fantasy",
              ReleaseDate: new Date(1937, 8, 21),
              AvailableQuantity: 15,
              editMode: false,
            },
            {
              ID: "4",
              Name: "Pride and Prejudice",
              Author: "Jane Austen",
              Genre: "Romance",
              ReleaseDate: new Date(1813, 0, 28),
              AvailableQuantity: 4,
              editMode: false,
            },
            {
              ID: "5",
              Name: "The Great Gatsby",
              Author: "F. Scott Fitzgerald",
              Genre: "Classic",
              ReleaseDate: new Date(1925, 3, 10),
              AvailableQuantity: 9,
              editMode: false,
            },
            {
              ID: "6",
              Name: "Dune",
              Author: "Frank Herbert",
              Genre: "Science Fiction",
              ReleaseDate: new Date(1965, 7, 1),
              AvailableQuantity: 0,
              editMode: false,
            },
            {
              ID: "7",
              Name: "The Catcher in the Rye",
              Author: "J.D. Salinger",
              Genre: "Classic",
              ReleaseDate: new Date(1951, 6, 16),
              AvailableQuantity: 5,
              editMode: false,
            },
            {
              ID: "8",
              Name: "Fahrenheit 451",
              Author: "Ray Bradbury",
              Genre: "Dystopian",
              ReleaseDate: new Date(1953, 9, 19),
              AvailableQuantity: 8,
              editMode: false,
            },
            {
              ID: "9",
              Name: "Harry Potter and the Philosopher's Stone",
              Author: "J.K. Rowling",
              Genre: "Fantasy",
              ReleaseDate: new Date(1997, 5, 26),
              AvailableQuantity: 20,
              editMode: false,
            },
            {
              ID: "10",
              Name: "One Hundred Years of Solitude",
              Author: "Gabriel García Márquez",
              Genre: "Magical Realism",
              ReleaseDate: new Date(1967, 4, 30),
              AvailableQuantity: 3,
              editMode: false,
            },
          ],
        };

        const oModel = new JSONModel(oData);
        this.getView().setModel(oModel, "books");

        const aUniqueGenres = [
          ...new Set(oData.books.map((oBook) => oBook.Genre)),
        ];

        const aGenres = aUniqueGenres.map((sGenre) => ({
          key: sGenre,
          text: sGenre,
        }));

        oModel.setProperty("/genres", [
          { key: "", text: this.getText("allGenresOption") },
          ...aGenres,
        ]);
        oModel.setProperty("/addNewBookGenres", aGenres);
      },

      onFilter() {
        const sQuery = this.byId("titleFilterInput").getValue();
        const sGenre = this.byId("genreSelect").getSelectedKey();

        const aFilters = [];

        if (sQuery) {
          aFilters.push(new Filter("Name", FilterOperator.Contains, sQuery));
        }

        if (sGenre) {
          aFilters.push(new Filter("Genre", FilterOperator.EQ, sGenre));
        }

        this.byId("booksTable").getBinding("items").filter(aFilters);
      },

      onAddDialog() {
        Fragment.load({
          id: this.getView().getId(),
          name: "project1.view.fragment.AddBookDialog",
          controller: this,
        }).then((oDialog) => {
          const oNewBook = {
            Name: "",
            Author: "",
            Genre: "",
            ReleaseDate: null,
            AvailableQuantity: 0,
            editMode: false,
          };

          this.getModel("books").setProperty("/newBook", oNewBook);

          this.getView().addDependent(oDialog);
          oDialog.open();
        });
      },

      verifyNewBook(oNewBook) {
        const sName = (oNewBook.Name || "").trim();
        const sAuthor = (oNewBook.Author || "").trim();
        const sGenre = (oNewBook.Genre || "").trim();
        const sQuantity = (oNewBook.AvailableQuantity || "0").trim();
        const iQuantity = Number(sQuantity);
        const oReleaseDate = new Date(oNewBook.ReleaseDate);

        if (!sName || !sAuthor || !sGenre) {
          return { ok: false };
        }

        if (!oNewBook.ReleaseDate || oReleaseDate > new Date()) {
          return { ok: false, message: this.getText("invalidDateMessage") };
        }

        if (!Number.isInteger(iQuantity) || iQuantity <= 0) {
          return { ok: false, message: this.getText("invalidQuantityMessage") };
        }

        return {
          ok: true,
          book: {
            ...oNewBook,
            AvailableQuantity: iQuantity,
            ReleaseDate: oReleaseDate,
          },
        };
      },

      onAddRecord() {
        const oModel = this.getModel("books");
        const aBooks = oModel.getProperty("/books");
        const oNewBook = oModel.getProperty("/newBook");

        const oNewBookVerified = this.verifyNewBook(oNewBook);
        if (!oNewBookVerified.ok) {
          MessageToast.show(
            oNewBookVerified.message || this.getText("fillAllFieldsMessage"),
          );
          return;
        }

        const iMaxId = Math.max(0, ...aBooks.map((oBook) => Number(oBook.ID)));
        aBooks.push({ ...oNewBookVerified.book, ID: String(iMaxId + 1) });

        oModel.setProperty("/books", aBooks);
        this.onAddDialogClose();
      },

      onAddDialogClose() {
        this.byId("AddBookDialog").close();
      },

      onAddDialogAfterClose() {
        this.byId("AddBookDialog").destroy();
      },

      onDeleteDialog() {
        const oTable = this.byId("booksTable");
        const aContexts = oTable.getSelectedContexts();

        if (aContexts.length === 0) {
          MessageToast.show(this.getText("selectRecordToDeleteMessage"));
          return;
        }

        const oDialog = new Dialog({
          title: this.getText("deleteDialogTitle"),
          content: new Text({ text: this.getText("deleteDialogMessage") }),
          beginButton: new Button({
            text: this.getText("deleteDialogYesButton"),
            press: () => {
              this.onDeleteRecord();
              oDialog.close();
            },
          }),
          endButton: new Button({
            text: this.getText("deleteDialogNoButton"),
            press: () => {
              oDialog.close();
            },
          }),
          afterClose: () => {
            oDialog.destroy();
          },
        });

        oDialog.open();
      },

      onDeleteRecord() {
        const oTable = this.byId("booksTable");
        const aContexts = oTable.getSelectedContexts();

        const oModel = this.getModel("books");
        const aBooks = oModel.getProperty("/books");

        const oSelectedBooks = new Set(
          aContexts.map((oContext) => oContext.getObject()),
        );
        const aRemainingBooks = aBooks.filter(
          (oBook) => !oSelectedBooks.has(oBook),
        );
        oModel.setProperty("/books", aRemainingBooks);

        oTable.removeSelections();
      },

      onActionsButton(oEvent) {
        const oModel = this.getModel("books");
        const oContext = oEvent.getSource().getBindingContext("books");
        const sPath = oContext.getPath() + "/editMode";

        oModel.setProperty(sPath, !oModel.getProperty(sPath));
      },

      formatter: formatter,
    });
  },
);
