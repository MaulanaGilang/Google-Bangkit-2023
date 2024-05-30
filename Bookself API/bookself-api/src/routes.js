const {
  addBooks,
  getBooks,
  getBooksByIdHandler,
  editBooksByIdHandler,
  deleteBooksByIdHandler,
} = require("./handler");

const routes = [
  {
    method: "POST",
    path: "/books",
    handler: addBooks,
  },
  {
    method: "GET",
    path: "/books",
    handler: getBooks,
  },
  {
    method: "GET",
    path: "/books/{bookId}",
    handler: getBooksByIdHandler,
  },
  {
    method: "PUT",
    path: "/books/{bookId}",
    handler: editBooksByIdHandler,
  },
  {
    method: "DELETE",
    path: "/books/{bookId}",
    handler: deleteBooksByIdHandler,
  },
];

module.exports = routes;
