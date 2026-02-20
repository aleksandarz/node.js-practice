
const handleAPICall = (req, res) => {

  const response = { success: true };
  const data = JSON.stringify(response);

  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(data);

}

module.exports = { handleAPICall }