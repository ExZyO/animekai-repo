// ==DantotsuSource==
// @name         AnimeKai
// @version      1.0.0
// @description  Anime source for animekai.to
// @author       YourName
// @match        https://animekai.to/*
// ==/DantotsuSource==

class AnimeKai {
  constructor() {
    this.name = "AnimeKai";
    this.baseUrl = "https://animekai.to";
    this.lang = "en";
  }

  // 1. Fetch popular/completed/releasing anime page
  async popular(page = 1) {
    const url = `${this.baseUrl}/completed?page=${page}`;
    const res = await fetch(url);
    const html = await res.text();
    const dom = new DOMParser().parseFromString(html, "text/html");
    return [...dom.querySelectorAll("ul.items li a")].map(el => ({
      title: el.querySelector(".name")?.textContent.trim(),
      url: new URL(el.getAttribute("href"), this.baseUrl).href,
      thumbnail: el.querySelector("div.thumb_anime")?.style.background?.match(/url\('(.+)'\)/)?.[1]
    }));
  }

  // 2. Search by keyword
  async search(query, page = 1) {
    const url = `${this.baseUrl}/search?keyword=${encodeURIComponent(query)}&page=${page}`;
    const res = await fetch(url);
    const html = await res.text();
    const dom = new DOMParser().parseFromString(html, "text/html");
    return [...dom.querySelectorAll("ul.items li a")].map(el => ({
      title: el.querySelector(".name")?.textContent.trim(),
      url: new URL(el.getAttribute("href"), this.baseUrl).href,
      thumbnail: el.querySelector("div.thumb_anime")?.style.background?.match(/url\('(.+)'\)/)?.[1]
    }));
  }

  // 3. Get episodes list
  async episodes(animeUrl) {
    const res = await fetch(animeUrl);
    const html = await res.text();
    const dom = new DOMParser().parseFromString(html, "text/html");
    return [...dom.querySelectorAll("ul.items li a")].map(ep => ({
      title: ep.querySelector(".name")?.textContent.trim(),
      url: new URL(ep.getAttribute("href"), this.baseUrl).href
    }));
  }

  // 4. Extract video sources (iframe embed)
  async sources(episodeUrl) {
    const res = await fetch(episodeUrl);
    const html = await res.text();
    const dom = new DOMParser().parseFromString(html, "text/html");
    const iframe = dom.querySelector("iframe");
    if (!iframe) return [];
    const src = iframe.getAttribute("src");
    return [{ url: src.startsWith("http") ? src : new URL(src, this.baseUrl).href, quality: "default" }];
  }
}

window.source = new AnimeKai();