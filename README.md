# Carimo Silky — Next.js experience

Site de présentation en français construit avec Next.js App Router, React, Three.js et GSAP ScrollTrigger.

## Exécuter

```sh
npm install
npm run dev
```

Ouvrir http://127.0.0.1:3000. `npm run build` crée un export statique dans `out/`.

## Direction artistique

Noir charbon, or patiné et textes champagne, d’après la référence graphique Carimo fournie. Fond à halos et arcs dorés, particules discrètes, composition de flacons interactive en WebGL, révélations et parallaxes au défilement. L’atelier du soin propose six étapes et une vue immersive avec navigation entre produits. Les mouvements peuvent être réduits avec le bouton en pied de page. La préférence système de réduction des animations est également respectée.

Les six modèles 3D sont des interprétations procédurales des conditionnements du PDF fourni, avec étiquettes recréées pour l’expérience ; ils ne constituent pas des fichiers industriels ni des reproductions exactes des emballages. Les modèles se tournent par glissement du pointeur. Un visuel de collection est affiché si WebGL est indisponible.

Les descriptions et renseignements sur l’atelier proviennent de `Invitation silky2.pdf`. Les dates et lieux de l’atelier sont à confirmer ; aucune adresse ni date de tenue n’a été inventée. Le bouton de contact ouvre l’application téléphonique, sans envoyer de message ni enregistrer une réservation.

`dist/` conserve la première proposition HTML. La version active est dans `app/`, `components/` et `public/`.
