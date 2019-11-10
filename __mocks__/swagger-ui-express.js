const mockServe = jest.fn();
const mockSetup = jest.fn(() => ({}));

module.exports = {
    serve: mockServe,
    setup: mockSetup,
};
