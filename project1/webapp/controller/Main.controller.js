sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], (BaseController, JSONModel, MessageToast, Filter, FilterOperator) => {
    "use strict";

    return BaseController.extend("project1.controller.Main", {
        onInit() {
            const oData = {
                books: [
                    { ID: "1", Name: "1984", Author: "George Orwell", Genre: "Dystopian", ReleaseDate: new Date(1949, 5, 8), AvailableQuantity: 12, editMode: false },
                    { ID: "2", Name: "To Kill a Mockingbird", Author: "Harper Lee", Genre: "Classic", ReleaseDate: new Date(1960, 6, 11), AvailableQuantity: 7, editMode: false },
                    { ID: "3", Name: "The Hobbit", Author: "J.R.R. Tolkien", Genre: "Fantasy", ReleaseDate: new Date(1937, 8, 21), AvailableQuantity: 15, editMode: false },
                    { ID: "4", Name: "Pride and Prejudice", Author: "Jane Austen", Genre: "Romance", ReleaseDate: new Date(1813, 0, 28), AvailableQuantity: 4, editMode: false },
                    { ID: "5", Name: "The Great Gatsby", Author: "F. Scott Fitzgerald", Genre: "Classic", ReleaseDate: new Date(1925, 3, 10), AvailableQuantity: 9, editMode: false },
                    { ID: "6", Name: "Dune", Author: "Frank Herbert", Genre: "Science Fiction", ReleaseDate: new Date(1965, 7, 1), AvailableQuantity: 0, editMode: false },
                    { ID: "7", Name: "The Catcher in the Rye", Author: "J.D. Salinger", Genre: "Classic", ReleaseDate: new Date(1951, 6, 16), AvailableQuantity: 5, editMode: false },
                    { ID: "8", Name: "Fahrenheit 451", Author: "Ray Bradbury", Genre: "Dystopian", ReleaseDate: new Date(1953, 9, 19), AvailableQuantity: 8, editMode: false },
                    { ID: "9", Name: "Harry Potter and the Philosopher's Stone", Author: "J.K. Rowling", Genre: "Fantasy", ReleaseDate: new Date(1997, 5, 26), AvailableQuantity: 20, editMode: false },
                    { ID: "10", Name: "One Hundred Years of Solitude", Author: "Gabriel García Márquez", Genre: "Magical Realism", ReleaseDate: new Date(1967, 4, 30), AvailableQuantity: 3, editMode: false }
                ]
            };

            const oModel = new JSONModel(oData);
            this.getView().setModel(oModel, "books");

            const aUniqueGenres = [...new Set(oData.books.map((oBook) => oBook.Genre))];

            const aGenres = aUniqueGenres.map((sGenre) => ({ key: sGenre, text: sGenre }));
            aGenres.unshift({ key: "", text: "All Genres" });

            oModel.setProperty("/genres", aGenres);
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

        onAddRecord() {
            const oModel = this.getModel("books");

            const aBooks = oModel.getProperty("/books");
            const oNewBook = {
                ID: String(aBooks.length + 1),
                Name: "",
                Author: "",
                Genre: "",
                ReleaseDate: null,
                AvailableQuantity: 0,
                editMode: false
            };

            aBooks.push(oNewBook);

            oModel.setProperty("/books", aBooks);
        },

        onDeleteRecord() {
            const oTable = this.byId("booksTable");
            const aContexts = oTable.getSelectedContexts();

            if (aContexts.length === 0) {
                MessageToast.show("Please select at least one record to delete.");
                return;
            }

            const oModel = this.getModel("books");
            const aBooks = oModel.getProperty("/books");

            const oSelectedBooks = new Set(aContexts.map((oContext) => oContext.getObject()));
            const aRemainingBooks = aBooks.filter((oBook) => !oSelectedBooks.has(oBook));
            oModel.setProperty("/books", aRemainingBooks);

            oTable.removeSelections();
        },

        onActionsButton(oEvent) {
            const oModel = this.getModel("books");
            const oContext = oEvent.getSource().getBindingContext("books");
            const sPath = oContext.getPath() + "/editMode";

            oModel.setProperty(sPath, !oModel.getProperty(sPath));
        }
    });
});