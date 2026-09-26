const apiTokenInput = document.getElementById("apiTokenInput");
const urlInput = document.getElementById("urlInput");
const codeforcesUsernameInput = document.getElementById("codeforcesUsernameInput");
const luoguUsernameInput = document.getElementById("luoguUsernameInput");
const saveButton = document.getElementById("saveButton");

// 回显 API Token
async function loadSavedToken()
{
	const storedResult = await chrome.storage.local.get(['apiToken', 'url', 'codeforcesUsername', 'luoguUsername']);
	const storedApiToken = storedResult.apiToken;
	const storedUrl = storedResult.url;
	const storedCodeforcesUsername = storedResult.codeforcesUsername;
	const storedLuoguUsername = storedResult.luoguUsername;
	apiTokenInput.value = storedApiToken || "";
	urlInput.value = storedUrl || "";
	codeforcesUsernameInput.value = storedCodeforcesUsername || "";
	luoguUsernameInput.value = storedLuoguUsername || "";
}
loadSavedToken();

saveButton.addEventListener("click", async () =>
{
	// 保存 API Token
	const tokenValue = apiTokenInput.value; // 先把输入框里的文字拿出来
	const url = urlInput.value;
	const codeforcesUsername = codeforcesUsernameInput.value;
	const luoguUsername = luoguUsernameInput.value;
	await chrome.storage.local.set(
		{
			apiToken: tokenValue,
			url: url,
			codeforcesUsername: codeforcesUsername,
			luoguUsername: luoguUsername
		}) // 存成对象形式
	saveButton.textContent = "已保存";
	setTimeout(() =>
	{
		saveButton.textContent = "保存";
	}, 2000);
})