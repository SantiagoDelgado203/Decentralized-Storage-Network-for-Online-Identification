app.get("/test", (req, res) => {
  res.send("Hello World");
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
