# Annuaire Employés - Services Orange 🧑‍💼

Une application web moderne de gestion d'annuaire employés développée en HTML5, CSS3 et JavaScript vanilla. Cette application permet d'ajouter, afficher, rechercher et supprimer des employés avec une interface utilisateur intuitive et responsive.

## 📋 Fonctionnalités

### ✨ Fonctionnalités principales
- **Ajout d'employés** avec validation en temps réel
- **Liste des employés** avec affichage en cartes
- **Recherche avancée** par nom, prénom, email ou poste
- **Filtrage par département**
- **Suppression d'employés** avec confirmation
- **Statistiques en temps réel** (nombre total d'employés)
- **Persistance des données** avec localStorage

### 🎨 Interface utilisateur
- Design moderne et responsive
- Interface bilingue (français)
- Animations fluides et transitions
- Mode sombre automatique (selon les préférences système)
- Compatibilité mobile et desktop

### 🔧 Fonctionnalités techniques
- Validation de formulaire côté client
- Gestion d'erreurs robuste
- Sauvegarde automatique des données
- Raccourcis clavier (Ctrl+N, Ctrl+L)
- Architecture modulaire et orientée objet

## 🚀 Installation et utilisation

### Prérequis
- Navigateur web moderne (Chrome, Firefox, Safari, Edge)
- Serveur web local (optionnel, peut fonctionner en fichier local)

### Installation
1. Clonez ou téléchargez les fichiers du projet
2. Assurez-vous d'avoir la structure suivante :
```
chalenge_orange_summer/
├── index.html
├── style.css
├── script.js
└── img/
    └── orange.jpg
```

### Lancement

1. ** - Fichier local** :
   Double-cliquez sur `index.html`

## 📱 Utilisation

### Ajouter un employé
1. Cliquez sur "Ajouter un employé"
2. Remplissez les champs obligatoires (Nom, Prénom, Email, Poste)
3. Complétez les champs optionnels (Téléphone, Département)
4. Cliquez sur "Ajouter l'employé"

### Consulter la liste
1. Cliquez sur "Liste des employés"
2. Utilisez la barre de recherche pour filtrer
3. Sélectionnez un département dans le menu déroulant

### Supprimer un employé
1. Dans la liste des employés, cliquez sur "Supprimer"
2. Confirmez la suppression dans la boîte de dialogue

## 🔧 Structure technique

### Architecture
```
EmployeeDirectory (Classe principale)
├── Gestion des employés (CRUD)
├── Validation des formulaires
├── Filtrage et recherche
├── Persistance localStorage
└── Gestion de l'interface
```

### Fichiers principaux

#### `index.html`
- Structure HTML sémantique
- Intégration Font Awesome pour les icônes
- Formulaire de saisie avec validation
- Interface de liste et recherche
- Modal de confirmation

#### `style.css`
- Variables CSS personnalisées
- Design responsive avec Grid et Flexbox
- Animations et transitions fluides
- Thème Orange avec dégradés
- Support du mode sombre

#### `script.js`
- Classe `EmployeeDirectory` pour la logique métier
- Gestion des événements DOM
- Validation côté client
- Persistance localStorage
- Fonctions utilitaires

### Données employé
```javascript
{
  id: "timestamp_unique",
  lastName: "Nom",
  firstName: "Prénom", 
  email: "email@example.com",
  position: "Poste",
  phone: "Téléphone",
  department: "Département",
  createdAt: "2024-01-01T00:00:00.000Z"
}
```

## 🎨 Personnalisation

### Couleurs du thème
```css
:root {
  --primary-color: #ff6b35;    /* Orange principal */
  --secondary-color: #f7931e;  /* Orange secondaire */
  --accent-color: #2c3e50;     /* Bleu foncé */
}
```

### Départements disponibles
- Informatique (IT)
- Ressources Humaines (RH)
- Commercial
- Marketing
- Finance
- Opérations

Pour ajouter un département, modifiez les options dans :
- Le formulaire (`index.html`)
- Le filtre de recherche (`index.html`)
- La méthode `getDepartmentName()` (`script.js`)

## 📊 Fonctionnalités avancées

### Validation des données
- **Nom/Prénom** : Minimum 2 caractères
- **Email** : Format email valide + unicité
- **Poste** : Requis, minimum 2 caractères
- **Téléphone** : Format libre (optionnel)

### Recherche intelligente
- Recherche dans tous les champs texte
- Insensible à la casse
- Filtrage en temps réel
- Combinaison recherche + filtre département

### Persistance des données
- Sauvegarde automatique dans localStorage
- Récupération au chargement de la page
- Gestion des erreurs de stockage
- Export possible des données (fonction disponible)

## 🔒 Sécurité et limitations

### Sécurité
- Validation côté client uniquement
- Données stockées localement dans le navigateur
- Pas d'authentification utilisateur
- Pas de chiffrement des données

### Limitations
- Stockage limité par localStorage (~5-10MB)
- Données perdues si cache navigateur effacé
- Pas de synchronisation multi-appareils
- Pas de sauvegarde automatique externe

## 🚀 Améliorations possibles

### Fonctionnalités
- [ ] Export/Import CSV/JSON
- [ ] Impression de fiches employés
- [ ] Photos de profil
- [ ] Historique des modifications
- [ ] Tri avancé des listes
- [ ] Groupement par département

### Technique
- [ ] API REST pour persistance serveur
- [ ] Base de données (MySQL, PostgreSQL)
- [ ] Authentification utilisateur
- [ ] Progressive Web App (PWA)
- [ ] Tests automatisés
- [ ] Internationalisation (i18n)

## 🐛 Résolution de problèmes

### Problèmes courants

**Les données disparaissent**
- Vérifiez que localStorage est activé
- Évitez le mode navigation privée
- Vérifiez l'espace de stockage disponible

**L'application ne s'affiche pas correctement**
- Vérifiez que tous les fichiers sont présents
- Testez avec un serveur local
- Vérifiez la console navigateur pour les erreurs

**La validation ne fonctionne pas**
- Vérifiez que JavaScript est activé
- Testez avec un navigateur récent
- Vérifiez les erreurs dans la console

## 📞 Support

Pour toute question ou problème :
- Ouvrez une issue sur GitHub
- Consultez la documentation du code
- Vérifiez les logs de la console navigateur

---
depot github https://github.com/migos276/challenge_orange_summer
depot gitlab https://gitlab.com/tchemoumiguel-group/tchemoumiguel-project

**Développé avec ❤️ pour Services Orange**

*Version 1.0.0 - Dernière mise à jour : Juin 2025*