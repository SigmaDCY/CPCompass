chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) =>
{
	console.log("Received message:", message);
	const data = await chrome.storage.local.get(['apiToken', 'url']);
	console.log(data.url + "/submit");
	fetch(data.url + "/submit",
		{
			method: "POST",
			headers:
			{
				"Content-Type": "application/json",
				"X-CP-Compass-API-Token": data.apiToken // 添加自定义头部
			},
			body: JSON.stringify(message) // 发送JSON数据
		})
});