!
function() {
	var a, b, c, d = encodeURIComponent,
	e = "1000106073",
	f = "3",
	g = "",
	h = "online_v3.php",
	i = "q1.cnzz.com",
	j = "1",
	k = "text",
	l = "q",
	m = "&#20840;&#26223;&#32479;&#35745;",
	n = window["_CNZZDbridge_" + e].bobject,
	o = "https:" == document.location.protocol ? "https:": "http:",
	p = "0",
	q = o + "//online.cnzz.com/online/" + h,
	r = [];
	r.push("id=" + e),
	r.push("h=" + i),
	r.push("on=" + d(g)),
	r.push("s=" + d(f)),
	q += "?" + r.join("&"),
	"0" === p && n.callRequest([o + "//cnzz.mmstat.com/9.gif?abc=1"]),
	j && ("" !== g ? n.createScriptIcon(q, "utf-8") : (b = "z" == l ? "http://www.cnzz.com/stat/website.php?web_id=" + e: "http://quanjing.cnzz.com", "pic" === k ? (c = o + "//icon.cnzz.com/img/" + f + ".gif", a = "<a href='" + b + "' target=_blank title='" + m + "'><img border=0 hspace=0 vspace=0 src='" + c + "'></a>") : a = "<a href='" + b + "' target=_blank title='" + m + "'>" + m + "</a>", n.createIcon([a])))
} ();