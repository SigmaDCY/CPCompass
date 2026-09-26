const codeElement = document.querySelector("pre");
const row = document.querySelector("tr.highlighted-row");
if (codeElement && row)
{
	let source = "Unknown";
	const url = document.location.href
	if (url.includes("codeforces.com"))
	{
		source = "Codeforces";
	}
	else if (url.includes("luogu.com.cn") || url.includes("luogu.com"))
	{
		source = "Luogu";
	}
	else if (url.includes("atcoder.jp"))
	{
		source = "AtCoder";
	}

	const codeText = codeElement.innerText;
	const cells = row.querySelectorAll("td");
	const submissionId = cells[0].innerText;
	const problemId = cells[2].innerText.split(" - ")[0].trim(); // 舍弃problem version信息
	const verdict = cells[4].innerText;
	const submissionTime = cells[7].innerText;
	const payload =
	{
		source: source,
		code: codeText,
		submissionId: submissionId,
		problemId: problemId,
		verdict: verdict,
		submissionTime: submissionTime
	}
	chrome.runtime.sendMessage(payload);
}
