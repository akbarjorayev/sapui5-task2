sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
], (Controller, JSONModel) => {
    "use strict";

    return Controller.extend("project1.controller.Main", {
        onInit() {
            const oData = {
                books: [
                    { ID: "1", Name: "1984", Author: "George Orwell", Genre: "Dystopian", ReleaseDate: new Date(1949, 5, 8), AvailableQuantity: 12 },
                    { ID: "2", Name: "To Kill a Mockingbird", Author: "Harper Lee", Genre: "Classic", ReleaseDate: new Date(1960, 6, 11), AvailableQuantity: 7 },
                    { ID: "3", Name: "The Hobbit", Author: "J.R.R. Tolkien", Genre: "Fantasy", ReleaseDate: new Date(1937, 8, 21), AvailableQuantity: 15 },
                    { ID: "4", Name: "Pride and Prejudice", Author: "Jane Austen", Genre: "Romance", ReleaseDate: new Date(1813, 0, 28), AvailableQuantity: 4 },
                    { ID: "5", Name: "The Great Gatsby", Author: "F. Scott Fitzgerald", Genre: "Classic", ReleaseDate: new Date(1925, 3, 10), AvailableQuantity: 9 },
                    { ID: "6", Name: "Dune", Author: "Frank Herbert", Genre: "Science Fiction", ReleaseDate: new Date(1965, 7, 1), AvailableQuantity: 0 },
                    { ID: "7", Name: "The Catcher in the Rye", Author: "J.D. Salinger", Genre: "Classic", ReleaseDate: new Date(1951, 6, 16), AvailableQuantity: 5 },
                    { ID: "8", Name: "Fahrenheit 451", Author: "Ray Bradbury", Genre: "Dystopian", ReleaseDate: new Date(1953, 9, 19), AvailableQuantity: 8 },
                    { ID: "9", Name: "Harry Potter and the Philosopher's Stone", Author: "J.K. Rowling", Genre: "Fantasy", ReleaseDate: new Date(1997, 5, 26), AvailableQuantity: 20 },
                    { ID: "10", Name: "One Hundred Years of Solitude", Author: "Gabriel García Márquez", Genre: "Magical Realism", ReleaseDate: new Date(1967, 4, 30), AvailableQuantity: 3 }
                ]
            };

            const oModel = new JSONModel(oData);
            this.getView().setModel(oModel, "books");
        }
    });
});