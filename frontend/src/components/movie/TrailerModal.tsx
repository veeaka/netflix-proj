import { Modal } from '../ui/Modal';
import { useUIStore } from '@/store/ui.store';

export function TrailerModal() {
  const { trailerKey, isTrailerOpen, closeTrailer } = useUIStore();

  return (
    <Modal isOpen={isTrailerOpen} onClose={closeTrailer} size="full">
      <div className="aspect-video w-full bg-black">
        {trailerKey && (
          <iframe
            src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&rel=0`}
            title="Trailer"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        )}
      </div>
    </Modal>
  );
}
