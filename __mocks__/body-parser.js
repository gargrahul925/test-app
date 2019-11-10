const bodyParser = jest.fn();
bodyParser.mockImplementation = {};
bodyParser.json = jest.fn();
bodyParser.json.mockImplementation(() => {});
bodyParser.urlencoded = jest.fn();
bodyParser.urlencoded.mockImplementation(() => {});

module.exports = bodyParser;
