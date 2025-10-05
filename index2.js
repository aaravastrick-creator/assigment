const express = require('express');
const app = express();
const port = 3000;
const judgesData = require("./data3.json")
const data = require("./data3.json")

app.use(express.json());

app.get('/api/judges', (req, res) => {
  res.json({judgesData,count: judgesData.length});
});

app.get('/api/judges/find', (req, res) => {


    const result = [];

Object.entries(data).forEach(([key, judges]) => {
  const parts = key.split("_Courts_");
  const complex = parts[0];
  const zone = parts[1] || "";
  
  judges.forEach(judge => {
    result.push({
      complex,
      zone,
      ...judge
    });
  });
});
  let filteredJudges = [...result];

  const {zone,complex} = req.query;
  if(!zone || !complex){
    return res.status(400).json({message:"zone and complex required"})
  }


//   const zone = req.query.zone;
  if (zone) {
    const zoneRegex = new RegExp(zone, 'i');
    filteredJudges = filteredJudges.filter(judge => zoneRegex.test(judge.zone));
  }


//   const complex = req.query.complex;
  if (complex) {
    const complexRegex = new RegExp(complex, 'i');
    filteredJudges = filteredJudges.filter(judge => complexRegex.test(judge.complex));
  }

  
  const search = req.query.search;
  if (search) {
    const searchRegex = new RegExp(search, 'i');
    filteredJudges = filteredJudges.filter(judge =>
      searchRegex.test(judge.Name) || searchRegex.test(judge.Designation)
    );
  }

  res.json({judge:filteredJudges, count:filteredJudges.length});
});


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});