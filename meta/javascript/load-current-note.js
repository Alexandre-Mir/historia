module.exports = async () => {
  const text = await navigator.clipboard.readText();
  if (text.trim()) window.open(text.trim());
};
