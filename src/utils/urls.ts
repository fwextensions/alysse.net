export const base = (url: string) => url.startsWith("/") ? (import.meta.env.BASE_URL + url).replace("//", "/") : url;

export const homeURL = base("/");
export const aboutURL = base("/about");
export const issuesURL = base("/issues");
export const endorsementsURL = base("/endorsements");
export const volunteerURL = base("/volunteer");
export const resourcesURL = base("/resources");
export const donateURL = base("/donate");

