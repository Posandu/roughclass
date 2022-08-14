import * as csstree from "css-tree";
import { load } from "cheerio";

function minify(css, html) {
	const CSS = css;
	const $ = load(html);

	let id = 0;

	const nanoid = () => {
		id++;

		const map = {
			0: "_",
			1: "_a",
			2: "_b",
			3: "_c",
			4: "_d",
			5: "_e",
			6: "_f",
			7: "_g",
			8: "_h",
			9: "_i",
		};

		return id.toString(36).replace(/[0-9]/g, (c) => map[c]);
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

		$(el).attr("class", classes.join(" "));
	});

	return {
		css: csstree.generate(CSSast),
		html: $("body").html(),
		replacedClasses,
	};
}

export default minify;
