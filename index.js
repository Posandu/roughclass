import * as csstree from "css-tree";
import { load } from "cheerio";

function minify(css, html, root = false) {
	const CSS = css;
	const $ = load(html);

	let id = 0;

	const nanoid = () => {
		id++;

		const text = id.toString(36);

		return text[0].match(/[a-z]/) ? text : `_${text}`;
	};

	const CSSast = csstree.parse(CSS);

	let replacedClasses = {};

	function unEscape(str) {
		const unescaped = str
			.replaceAll("\\2c", ",")
			.replaceAll(" ", "")
			.replace(/\\([^ ])/g, "$1");

		return unescaped;
	}

	csstree.walk(CSSast, (node) => {
		if (node.type === "ClassSelector") {
			const className = unEscape(node.name);

			if (className in replacedClasses) {
				node.name = replacedClasses[className];
			} else {
				const newClassName = nanoid();
				replacedClasses[className] = newClassName;
				node.name = newClassName;
			}
		}
	});

	$("*").each((_, el) => {
		let classes = $(el).attr("class") || "";

		classes = classes.split(" ").filter((c) => c.length > 0);

		classes = classes.map((className) => {
			if (className.trim() in replacedClasses) {
				return replacedClasses[className];
			}

			return className;
		});

		if (classes.length) $(el).attr("class", classes.join(" "));
	});

	return {
		css: csstree.generate(CSSast),
		html: root ? $.root().html() : $("body").html(),
		replacedClasses,
	};
}

export default minify;
