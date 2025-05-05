
// Format time helper
export const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

// Audio processing utilities
export const applyFilter = (audioContext: AudioContext, audioSource: MediaElementAudioSourceNode, filterType: BiquadFilterType, frequency: number, gain: number) => {
  const filter = audioContext.createBiquadFilter();
  filter.type = filterType;
  filter.frequency.value = frequency;
  if (filterType === 'peaking') {
    filter.gain.value = gain;
  }
  audioSource.connect(filter);
  filter.connect(audioContext.destination);
  return filter;
};
