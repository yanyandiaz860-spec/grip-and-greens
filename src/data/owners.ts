/**
 * OWNERS — mapping confirmed by the team on 2026-11-04.
 * Role is "Co-Owner" for all four; no other titles or personal details.
 * Photos are shown unretouched; only framing (crop focus / zoom) is set here.
 */
import type { ArtKey } from './media';

export interface Owner {
  name: string;
  role: 'Co-Owner';
  instagram: string; // handle without @
  photo: ArtKey;
  /** CSS object-position for the 4:5 frame */
  focus: string;
  /** Optional crop zoom so full-length and half-length photos frame consistently */
  zoom?: number;
}

export const owners: Owner[] = [
  { name: 'Mark Francis A. Polinar', role: 'Co-Owner', instagram: 'toyashi27', photo: 'owner.01', focus: '45% 85%' },
  { name: 'John Eidref C. Buenaventura', role: 'Co-Owner', instagram: 'johneidrefc.buenaventura', photo: 'owner.02', focus: '45% 20%' },
  { name: 'Ricky Yan F. Diaz', role: 'Co-Owner', instagram: 'yk.yanyan_', photo: 'owner.03', focus: '50% 18%', zoom: 1.45 },
  { name: 'Areown Dapne E. Venus', role: 'Co-Owner', instagram: 'areowna_', photo: 'owner.04', focus: '58% 22%', zoom: 1.4 },
];

export const instagramUrl = (handle: string) => `https://www.instagram.com/${encodeURIComponent(handle)}/`;
