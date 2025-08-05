import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-youtube-player',
  templateUrl: './youtube-player.component.html',
  styleUrls: ['./youtube-player.component.scss']
})
export class YoutubePlayerComponent implements OnInit {
  @Input() url: any;
  videoId: any;
  ngOnInit(): void {
    // console.log(this.url);
    // this.videoId = this.url.includes('watch?v=') ? this.getYouTubeVideoId(this.url) : this.getYouTubeShortId(this.url);
    this.videoId = this.getYouTubeVideoID(this.url);
  }
  getYouTubeVideoID(url: any) {
    // Regex patterns to match various YouTube URL formats
    const regex = [
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/, // Standard watch URL
      /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([a-zA-Z0-9_-]{11})/, // Shortened URL
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/, // Embedded URL
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/v\/([a-zA-Z0-9_-]{11})/, // Old embed URL format
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/, // Shorts URL
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/live\/([a-zA-Z0-9_-]{11})/, // Live URL
      /(?:https?:\/\/)?(?:m\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/, // Mobile watch URL
      /(?:https?:\/\/)?(?:m\.)?youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/, // Mobile embed URL
      /(?:https?:\/\/)?(?:m\.)?youtu\.be\/([a-zA-Z0-9_-]{11})/ // Mobile shortened URL
    ];

    for (const reg of regex) {
      const match = url.match(reg);
      if (match && match[1]) {
        return match[1];
      }
    }

    return null; // If no video ID is found, return null
  }
  getYouTubeShortId(url: any) {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/');
    return pathParts[1];
  }
  getYouTubeVideoId(url: any) {
    const urlParams = new URLSearchParams(new URL(url).search);
    return urlParams.get('v');
  }

}
