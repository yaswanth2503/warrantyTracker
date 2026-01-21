
function isValidEmail(email) {
  if (!email || typeof email !== "string") {
    return false;
  } 

  const cleanedEmail = email.trim();
  if (cleanedEmail.length < 5) {
    return false;
  } 

  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  return regex.test(cleanedEmail);
}

module.exports = {
    isValidEmail
}