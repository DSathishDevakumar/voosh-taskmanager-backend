
function Capitalize(text) {
	const capitalizedText = (text && text.length > 0) ? (text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()) : text;
	return capitalizedText;
}


module.exports = {
	Capitalize: Capitalize,
};
