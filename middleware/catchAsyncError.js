// A Reusable Function to working with async function and  avoid using trycatch block
module.exports = (theFunc) => (req, res, next) => {
    Promise.resolve(theFunc(req, res, next)).catch(next);
  };