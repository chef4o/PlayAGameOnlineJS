// Get all the username elements
const usernameElements = document.querySelectorAll('.username');

// Truncate the text for each username element
usernameElements.forEach((element) => {
  const originalText = element.textContent;
  const maxLength = 17; // Set the maximum length before truncation

  if (originalText.trim().length > maxLength) {
    const truncatedText = originalText.slice(0, maxLength) + '...';
    element.textContent = truncatedText;
    element.title = originalText; // Add the full text as a tooltip
  }
});