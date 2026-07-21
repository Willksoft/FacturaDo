import { useState, useCallback } from 'react';
import { NcfSequence, NcfType } from '../types';
import { initialNcfSequences } from '../dbSeed';
import { insforge } from '../lib/insforge';

export const mapNcfSequenceFromDb = (db: any): NcfSequence => ({
  type: db.type as NcfType,
  name: db.name,
  prefix: db.prefix,
  currentNumber: parseInt(db.current_number || 0),
  suffixLength: parseInt(db.suffix_length || 8),
  startNumber: db.start_number ? parseInt(db.start_number) : undefined,
  endNumber: db.end_number ? parseInt(db.end_number) : undefined
});

export const mapNcfSequenceToDb = (ncf: NcfSequence) => ({
  type: ncf.type,
  name: ncf.name,
  prefix: ncf.prefix,
  current_number: ncf.currentNumber,
  suffix_length: ncf.suffixLength,
  start_number: ncf.startNumber || null,
  end_number: ncf.endNumber || null
});

export function useNcfState(getDbPrefix: () => string) {
  const [ncfSequences, setNcfSequences] = useState<NcfSequence[]>(() => {
    const saved = localStorage.getItem('inv_ncf_sequences');
    return saved ? JSON.parse(saved) : initialNcfSequences;
  });

  const saveNcfSequences = useCallback((newSeq: NcfSequence[]) => {
    setNcfSequences(newSeq);
    localStorage.setItem('inv_ncf_sequences', JSON.stringify(newSeq));

    const prefix = getDbPrefix();
    const dbNcf = newSeq.map(seq => ({
      ...mapNcfSequenceToDb(seq),
      id: `${prefix}${seq.type}`
    }));

    insforge.database.from('ncf_sequences').upsert(dbNcf).then(({ error }) => {
      if (error) console.error('Error al actualizar secuencias NCF en BD:', error);
    });
  }, [getDbPrefix]);

  return {
    ncfSequences,
    setNcfSequences: saveNcfSequences
  };
}
