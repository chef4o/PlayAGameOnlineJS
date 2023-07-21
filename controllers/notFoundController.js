module.exports = (req, res) => {
  res.status(404).render("404", {
    title: "P@GE Not found",
    user: req.user
  });
}