// import all lib
const router = require("express").Router();
const { isAuthenticatedUser } = require("../middleware/auth");
const {
  createBlog,
  getAllBlogs,
  updateBlog,
  deleteBlog,
  addComment,
  addReact,
  userBaseBlog,
  getSingleBlog,
  deleteReact,
  deleteComment,
} = require("../controllers/postController");

//Api End Point
router.post("/create/blog", isAuthenticatedUser, createBlog);
router.get("/blogs", getAllBlogs);
router.get("/blog/:id", getSingleBlog);
router.put("/blog/update/:id", isAuthenticatedUser, updateBlog);
router.delete("/blog/delete/:id", isAuthenticatedUser, deleteBlog);
router.get("/user-blogs", isAuthenticatedUser, userBaseBlog);
router.get("/add-react/:postId/:userId", isAuthenticatedUser, addReact);
router.delete("/remove-react/:postId/:userId", isAuthenticatedUser, deleteReact);
router.post("/add-comment/:postId/:userId", isAuthenticatedUser, addComment);
router.delete("/remove-comment/:postId/:userId/:commentId", isAuthenticatedUser, deleteComment);

// export router
module.exports = router;
