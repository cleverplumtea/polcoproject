const router = require("express").Router();
const axios = require("axios");

router.get("/:tags/:sortBy?/:direction?", (req, res) => {
  const { tags, sortBy, direction } = req.params;
  const sorts = [
    undefined,
    "id",
    "author",
    "authorId",
    "likes",
    "popularity",
    "reads",
    "tags",
  ];
  const directions = [undefined, "asc", "desc"];

  if (!tags.length) {
    res.status(400).send({
      error: "Tags parameter is required",
    });
  }

  if (
    sorts.includes(sortBy) === false ||
    directions.includes(direction) === false
  ) {
    res.status(400).send({
      error: "sortBy parameter is invalid",
    });
  }

  if (tags.length > 1) {
    let arr = tags.split(",");
    let posts = arr.map((tag) => {
      return axios.get(
        `http://hatchways.io/api/assessment/blog/posts?tag=${tag}&sortBy=${sortBy}&direction=${direction}`
      );
    });

    Promise.all([...posts]).then(function (data) {
      let uniques = [...new Set(data)];
      console.log(uniques);
    });
  } else {
    // If the user only searches for one tag, then we don't have to worry about congruent calls and duplicate values
    axios
      .get(
        `http://hatchways.io/api/assessment/blog/posts?tag=${tags}&sortBy=${sortBy}&direction=${direction}`
      )
      .then((response) => {
        let data = response.data.posts;
        if (sortBy) {
          if (direction === "desc") {
            data = data.sort((a, b) => (b[sortBy] > a[sortBy] ? 1 : -1));
          } else {
            data = data.sort((a, b) => (b[sortBy] < a[sortBy] ? 1 : -1));
          }
        }
        res.status(200).send(data);
      });
  }
});

module.exports = router;
