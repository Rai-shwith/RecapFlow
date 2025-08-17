// Utility functions for markdown handling

// Convert markdown to plain text for editing
export const markdownToPlainText = (markdown) => {
  if (!markdown) return ''
  
  return markdown
    .replace(/\*\*(.*?)\*\*/g, '$1')  // Remove bold
    .replace(/\*(.*?)\*/g, '$1')      // Remove italic
    .replace(/`(.*?)`/g, '$1')        // Remove code
    .replace(/^#+\s*/gm, '')          // Remove headers
    .replace(/^[-*+]\s*/gm, '• ')     // Convert markdown lists to bullets
    .replace(/^\d+\.\s*/gm, '• ')     // Convert numbered lists to bullets
}

// Convert plain text back to markdown (basic)
export const plainTextToMarkdown = (text) => {
  if (!text) return ''
  
  return text.replace(/^• /gm, '- ') // Convert bullets back to markdown lists
}
