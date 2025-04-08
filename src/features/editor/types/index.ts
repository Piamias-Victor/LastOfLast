/**
 * Props pour le composant Editor
 */
export interface EditorProps {
    /** Classe CSS additionnelle */
    className?: string;
  }
  
  /**
   * Props pour le gestionnaire de raccourcis clavier
   */
  export interface KeyboardShortcutsProps {
    /** Fonction pour désélectionner tous les éléments */
    onDeselectAll: () => void;
  }
  
  /**
   * Props pour le composant EditorWrapper
   */
  export interface EditorWrapperProps {
    /** Contenu de l'éditeur */
    children: React.ReactNode;
    /** Classe CSS additionnelle */
    className?: string;
  }
  
  /**
   * Type pour les dimensions du conteneur
   */
  export interface ContainerSize {
    width: number;
    height: number;
  }