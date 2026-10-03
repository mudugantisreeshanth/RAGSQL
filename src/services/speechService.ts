export class SpeechService {
  private static recognition: any = null;

  static isSupported(): boolean {
    return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
  }

  static startListening(
    onResult: (text: string) => void,
    onError: (err: any) => void,
    onEnd: () => void,
    lang: string = 'en-US'
  ) {
    if (!this.isSupported()) {
      onError('Web Speech API is not supported in this browser.');
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    this.recognition = new SpeechRecognition();
    this.recognition.continuous = false;
    this.recognition.interimResults = true;
    this.recognition.lang = lang;

    this.recognition.onresult = (event: any) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      onResult(transcript);
    };

    this.recognition.onerror = (event: any) => {
      onError(event.error);
    };

    this.recognition.onend = () => {
      onEnd();
    };

    this.recognition.start();
  }

  static stopListening() {
    if (this.recognition) {
      this.recognition.stop();
      this.recognition = null;
    }
  }
}
