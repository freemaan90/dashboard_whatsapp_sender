'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Check, X, Pencil } from 'lucide-react';
import { getTemplates } from '@/app/actions/getTemplates';
import { createTemplate } from '@/app/actions/createTemplate';
import { updateTemplate } from '@/app/actions/updateTemplate';
import { deleteTemplate } from '@/app/actions/deleteTemplate';
import { MessageTemplate } from '@/app/interfaces/messageTemplate.interface';
import styles from './TemplatesPanel.module.css';

interface TemplatesPanelProps {
  onSelect: (content: string) => void;
}

export default function TemplatesPanel({ onSelect }: TemplatesPanelProps) {
  const [templates, setTemplates] = useState<MessageTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [newContent, setNewContent] = useState('');

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editContent, setEditContent] = useState('');

  async function loadTemplates() {
    setLoading(true);
    setError('');
    try {
      const data = await getTemplates();
      setTemplates(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar plantillas');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTemplates();
  }, []);

  async function handleCreate() {
    if (!newName.trim() || !newContent.trim()) return;
    setError('');
    try {
      await createTemplate(newName.trim(), newContent.trim());
      setNewName('');
      setNewContent('');
      setCreating(false);
      await loadTemplates();
    } catch (err: any) {
      setError(err.message || 'Error al crear plantilla');
    }
  }

  async function handleUpdate(id: string) {
    if (!editName.trim() || !editContent.trim()) return;
    setError('');
    try {
      await updateTemplate(id, { name: editName.trim(), content: editContent.trim() });
      setEditingId(null);
      await loadTemplates();
    } catch (err: any) {
      setError(err.message || 'Error al actualizar plantilla');
    }
  }

  async function handleDelete(id: string) {
    setError('');
    try {
      await deleteTemplate(id);
      await loadTemplates();
    } catch (err: any) {
      setError(err.message || 'Error al eliminar plantilla');
    }
  }

  function handleSelect(content: string) {
    onSelect(content);
  }

  function startEdit(template: MessageTemplate) {
    setEditingId(template.id);
    setEditName(template.name);
    setEditContent(template.content);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditName('');
    setEditContent('');
  }

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <span className={styles.title}>Plantillas</span>
        <button
          className={styles.addButton}
          onClick={() => setCreating((v) => !v)}
          aria-label="Nueva plantilla"
          title="Nueva plantilla"
        >
          <Plus size={16} />
        </button>
      </div>

      {error && <p className={styles.errorText}>{error}</p>}

      {creating && (
        <div className={styles.form}>
          <input
            className={styles.input}
            placeholder="Nombre de la plantilla"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            maxLength={100}
          />
          <textarea
            className={styles.textarea}
            placeholder="Contenido de la plantilla"
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            rows={3}
            maxLength={4096}
          />
          <div className={styles.actions}>
            <button className={styles.saveButton} onClick={handleCreate} aria-label="Guardar">
              <Check size={14} /> Guardar
            </button>
            <button
              className={styles.cancelButton}
              onClick={() => { setCreating(false); setNewName(''); setNewContent(''); }}
              aria-label="Cancelar"
            >
              <X size={14} /> Cancelar
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <p className={styles.emptyState}>Cargando...</p>
      ) : templates.length === 0 ? (
        <p className={styles.emptyState}>No hay plantillas. Crea una con el botón +</p>
      ) : (
        <ul className={styles.list}>
          {templates.map((t) =>
            editingId === t.id ? (
              <li key={t.id} className={styles.templateItem}>
                <div className={styles.form}>
                  <input
                    className={styles.input}
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    maxLength={100}
                  />
                  <textarea
                    className={styles.textarea}
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    rows={3}
                    maxLength={4096}
                  />
                  <div className={styles.actions}>
                    <button className={styles.saveButton} onClick={() => handleUpdate(t.id)} aria-label="Guardar">
                      <Check size={14} /> Guardar
                    </button>
                    <button className={styles.cancelButton} onClick={cancelEdit} aria-label="Cancelar">
                      <X size={14} /> Cancelar
                    </button>
                  </div>
                </div>
              </li>
            ) : (
              <li
                key={t.id}
                className={styles.templateItem}
                onClick={() => handleSelect(t.content)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && handleSelect(t.content)}
              >
                <div className={styles.templateName}>{t.name}</div>
                <div className={styles.templateContent}>{t.content}</div>
                <div
                  className={styles.actions}
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    className={styles.saveButton}
                    onClick={() => startEdit(t)}
                    aria-label="Editar plantilla"
                    title="Editar"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    className={styles.cancelButton}
                    onClick={() => handleDelete(t.id)}
                    aria-label="Eliminar plantilla"
                    title="Eliminar"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </li>
            )
          )}
        </ul>
      )}
    </div>
  );
}
