module.exports = (e, displayErrorMessage = true) => {
  if (displayErrorMessage) {
    console.error(e.message)
    console.error(e.stack)
  } else {
    console.error(e.message)
  }
  process.exit(1)
}
