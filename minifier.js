import * as csstree from "css-tree";
import { load } from "cheerio";

function minify(css, html) {
	const CSS = css;
	const $ = load(html);

	let id = 0;

	const nanoid = () => {
		id++;
		return id.toString(16).replace(/[0-9]/, () => {
			let str = String.fromCharCode((id % 26) + 97);
			return str;
		});
	};

	const CSSast = csstree.parse(CSS);

	let replacedClasses = {};

	function unEscape(str) {
		return str.replace(/\\(.)/g, "$1");
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

	$("*").each((i, el) => {
		let classes = $(el).attr("class") || "";
		classes = classes.split(" ");

		classes = classes.map((className) => {
			if (className in replacedClasses) {
				return replacedClasses[className];
			}
			return className;
		});

		$(el).attr("class", classes.join(" "));
	});

	return {
		css: csstree.generate(CSSast),
		html: $("body").html(),
		replacedClasses,
	};
}

export default minify;
