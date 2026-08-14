/**
 * Troubles — source : page Notion « Troubles ».
 * name : intitulé canonique (EN). desc : description (FR).
 * hooks : les 3 moments de déclenchement. questions : les 5 questions de background.
 */
export const TROUBLES = [
  {
    name: "A Higher Cause",
    desc: "Tu as une croyance religieuse ; ces idéologies s'accordent rarement avec le mode de vie du hors-la-loi interstellaire.",
    hooks: ["Quelqu'un rejette ta foi.", "Ta foi t'oblige à faire quelque chose de stupide.", "Tu enfreins un principe fondamental de ta foi."],
    questions: ["À quoi pries-tu ?", "Quels sont les principes centraux de ta foi ?", "As-tu déjà été témoin d'un miracle ?", "Quand ta foi a-t-elle été mise à l'épreuve ?", "Quel ami partage ta foi ?"]
  },
  {
    name: "Best Served Cold",
    desc: "Ils t'ont trahi, et ils vont le regretter.",
    hooks: ["Tu te souviens de ce que ça t'a coûté.", "Tu prépares une situation pour te venger.", "Tu franchis la limite que tu t'étais fixée."],
    questions: ["Qui t'a trahi ?", "Qu'ont-ils fait ?", "Pourquoi leur as-tu fait confiance ?", "Qu'est-ce que ça t'a coûté ?", "Quelle limite ne voulais-tu pas franchir pour te venger ?"]
  },
  {
    name: "Bloodthirsty",
    desc: "Le meilleur moyen de finir un combat est d'être prêt à commettre plus de violence que ton adversaire.",
    hooks: ["Tu perds ton sang-froid.", "Tu résous tes problèmes par la force plutôt que par les mots.", "Tu laisses un adversaire terrifié."],
    questions: ["Quel fut le premier combat que tu as gagné ?", "Quelle cicatrice portes-tu avec fierté ?", "Quels ennemis as-tu durement gagnés ?", "Quand as-tu tué quelqu'un que tu voulais seulement estropier ?", "Quel ancien ami a désormais peur de ta brutalité ?"]
  },
  {
    name: "Brick in the Wall",
    desc: "Tu es juste une personne normale, bien ajustée. Pas de drame, pas de trauma. Comment t'es-tu retrouvé ici ?",
    hooks: ["Quelqu'un profite de ta gentillesse.", "Tu fais quelque chose d'anodin.", "Quelqu'un te fait confiance alors qu'il ne ferait pas confiance à un hors-la-loi ordinaire."],
    questions: ["Comment as-tu eu une enfance sans histoire ?", "Quel ami te doit une faveur ?", "Quel est ton trait le plus rassurant ?", "Qui est la seule personne à ne pas trop t'aimer ?", "Comment as-tu fini sur la route au lieu d'un boulot classique ?"]
  },
  {
    name: "Close to Your Chest",
    desc: "Tu possèdes une information dangereuse, très recherchée ou scandaleuse. Tu sais quelque chose que tu ne devrais surtout pas savoir.",
    hooks: ["Tu gardes ton secret au détriment des autres.", "Tu retiens tes mots par égoïsme.", "Garder ton secret nuit à ta vie quotidienne."],
    questions: ["Quel est ton secret ?", "Qui souffrirait si tu le dévoilais ?", "Qu'est-ce que tu gagnes à le garder ?", "Qui pourrait bénéficier de cette révélation ?", "Qui partage ce fardeau avec toi ?"]
  },
  {
    name: "Devil in the Bottle",
    desc: "Tu dis à tes amis que tu gères bien. Ce n'est pas le cas.",
    hooks: ["Tu fais quelque chose en étant ivre qui te rappelle une autre bêtise passée.", "Tu arrêtes de boire pendant plus d'un jour ou deux.", "Tu fais face aux conséquences d'une gueule de bois."],
    questions: ["Quel est ton alcool préféré ?", "Où est ton repaire favori ? T'y apprécie-t-on ?", "Quelle est la chose la plus stupide faite en étant ivre ? Qui ça a énervé ?", "Qui est ton plus vieux compagnon de beuverie ?", "Quelle est ta cure de gueule de bois préférée ?"]
  },
  {
    name: "In Too Deep",
    desc: "Tu t'es retrouvé mêlé aux mauvaises personnes et tu as fait des choses dont tu n'es pas fier.",
    hooks: ["Tu comptes sur un talent appris d'un vieil ami.", "Tu te retiens d'une violence autrefois seconde nature.", "Tu obliges quelqu'un à faire quelque chose contre son gré."],
    questions: ["Avec quelle organisation peu recommandable as-tu travaillé ?", "Quel représentant de la loi se souvient de ton visage ?", "Quand as-tu réalisé que tu étais allé trop loin ?", "Comment t'en es-tu sorti ? Es-tu vraiment tiré d'affaire ?", "Quel vieil ami t'aiderait pour quelque chose d'illégal ?"]
  },
  {
    name: "Lost It All on the River",
    desc: "Il faut jouer la main que la vie t'a donnée. Tu aimes le jeu, et tu ne jettes jamais tes cartes.",
    hooks: ["Tu défies les probabilités et tu gagnes gros.", "Tu fais un bluff extravagant.", "Tu mises tout et tu le regrettes."],
    questions: ["À quel jeu joues-tu ?", "Dans quel antre de vice as-tu remporté ta première fortune ?", "Quel est ton tic quand tu bluffes ?", "Quel vieil ami t'a vu perdre gros ?", "Qu'as-tu perdu de plus important en une seule main ? À qui ?"]
  },
  {
    name: "Lovesick",
    desc: "Tu avais un·e amoureux·se, mais maintenant il/elle n'est plus là. Ce n'est pas vraiment agréable.",
    hooks: ["Quelque chose te rappelle cette personne et ça pique un peu.", "Quelque chose te rappelle cette personne et elle te manque énormément.", "Quelque chose te rappelle cette personne et ça te vide complètement."],
    questions: ["Comment as-tu rencontré ton amour perdu ?", "Qui a dit « je t'aime » en premier ?", "Comment avez-vous passé votre plus belle journée ensemble ?", "Quand as-tu compris que c'était fini ?", "Où cela s'est-il terminé ?"]
  },
  {
    name: "On the Run",
    desc: "Tu t'es frotté à quelqu'un qu'il ne fallait pas, et tu t'es enfui comme un chien.",
    hooks: ["Tu évites un problème au lieu de l'affronter.", "Tu imagines voir tes poursuivants alors qu'ils ne sont pas là.", "Tu abandonnes quelqu'un pour t'échapper."],
    questions: ["Qui fuis-tu, et pourquoi ?", "Es-tu coupable de ce dont on t'accuse ?", "Pourquoi n'as-tu pas affronté ces personnes ?", "Qui t'a aidé à t'échapper ?", "Qui as-tu laissé derrière toi ?"]
  },
  {
    name: "Orbital Blues",
    desc: "La réalité est impitoyable. Tous les autres combattent aussi les Blues, mais toi, tu as tout perdu.",
    hooks: ["Tu luttes contre les Blues.", "Tu infliges les Blues à quelqu'un d'autre.", "Tu vois quelqu'un profiter de quelque chose que les Blues t'ont gâché."],
    questions: ["Qu'est-ce qui a provoqué l'apparition des Blues ?", "Qu'aimais-tu avant d'avoir les Blues ?", "Qu'est-ce qui te donne la force de sortir du lit chaque jour ?", "Comment fais-tu face aux Blues ?", "Qui t'aide à traverser les Blues ?"]
  },
  {
    name: "Papa Was a Rolling Stone",
    desc: "Un de tes parents était une légende. Quoi qu'il en soit, tu vivras toujours dans leur ombre.",
    hooks: ["La réputation de ton ancêtre mine tes propres réussites.", "On doute de tes capacités par rapport à celles de ton prédécesseur.", "On compare tes talents ou accomplissements aux leurs."],
    questions: ["Sous l'ombre de qui vis-tu ?", "Pourquoi étaient-ils si réputés ?", "Comment espères-tu les surpasser ?", "En quoi leur réputation te hante-t-elle ?", "Comment t'es-tu affranchi de leur influence ?"]
  },
  {
    name: "Party Animal",
    desc: "Tu sais comment vivre. Ne laisse personne te dire le contraire.",
    hooks: ["Tu prends plus de plaisir que tu ne le devrais sans doute.", "Tu fais une grosse bêtise dans une situation très grave.", "Tu dissimules tes vrais sentiments dans la débauche."],
    questions: ["Où vas-tu pour te défouler ?", "Quel est le pire crime commis en cherchant juste à t'amuser ?", "Avec qui fais-tu la fête ?", "Quelles drogues t'aident à trouver ce zen fuyant ?", "Quel sentiment enfouis-tu sous les drogues et les mauvaises décisions ?"]
  },
  {
    name: "Reluctant Vagabond",
    desc: "Tu avais une belle vie quelque part, plus confortable que la vie sur la route. Ça te manque au point de te ronger de l'intérieur.",
    hooks: ["Tu te souviens de ce que tu as laissé derrière toi.", "Tu vois d'autres vivre une vie confortable et stable.", "Tu te plains de ta nouvelle vie."],
    questions: ["Qu'as-tu laissé derrière toi ?", "Qu'est-ce qui t'a forcé à prendre la route ?", "Penses-tu pouvoir revenir un jour ?", "Où vas-tu maintenant ?", "Qui t'attend là-bas ?"]
  },
  {
    name: "Struggling Artist",
    desc: "Tu es un artiste. Un jour, ils te reconnaîtront. Tous finiront par te voir.",
    hooks: ["Tu comptes sur ton talent.", "Quelque chose te rappelle ton échec.", "Quelqu'un fait une remarque sur ton talent."],
    questions: ["Comment exprimes-tu ton talent ?", "Qui a cru en toi ?", "Pourquoi n'as-tu jamais percé ?", "Qui t'a dit que tu n'y arriverais jamais ?", "Quand as-tu enfin admis que ça ne marcherait pas ?"]
  },
  {
    name: "The Road Not Taken",
    desc: "Quelque chose t'a échappé, et tu n'arrives pas à l'oublier.",
    hooks: ["Tu penses au chemin que tu as laissé derrière toi.", "La réalité de ta voie choisie te revient en tête.", "Tu essaies, sans succès, de changer de route."],
    questions: ["Quel choix regrettes-tu aujourd'hui ?", "Pourquoi n'as-tu pas pris l'autre chemin ?", "Qu'est-ce qui t'empêche de changer d'avis maintenant ?", "Le respect de qui as-tu perdu en choisissant cette voie ?", "En quoi l'autre voie aurait-elle amélioré ta vie ?"]
  },
  {
    name: "Through Your Teeth",
    desc: "Tu n'as jamais trouvé de mot honnête plus efficace qu'un mensonge bien placé.",
    hooks: ["Quelqu'un ne te fait pas confiance alors qu'il le devrait.", "Tu mens par habitude alors que ce n'est pas nécessaire.", "Tu révèles accidentellement une vérité sur toi à travers un mensonge."],
    questions: ["Où as-tu appris à mentir ?", "Quelle est la plus grande chose que la vérité t'ait coûtée ?", "Comment transformes-tu les mensonges en argent ?", "La confiance de qui as-tu perdue à cause de ta langue bien pendue ?", "Qui chercherait ta ruine s'il connaissait la vérité ?"]
  },
  {
    name: "Time Behind Bars",
    desc: "Tu as passé du temps en prison, pour des crimes que tu as commis ou non. Tu es dehors maintenant, mais ça t'a changé.",
    hooks: ["Quelque chose te rappelle ta cellule ou tes codétenus.", "Quelque chose te rappelle tes geôliers.", "Tu utilises une compétence apprise en prison."],
    questions: ["Pour quel crime as-tu été condamné ? L'as-tu commis ?", "Quelles compétences inhabituelles as-tu acquises ?", "Quels amis t'es-tu faits en prison ?", "Quels ennemis t'es-tu faits en prison ?", "Où as-tu purgé ta peine, et combien de temps ?"]
  },
  {
    name: "Too Big for Your Boots",
    desc: "Tu es le meilleur dans un domaine, et tu le sais. Que Dieu aide quiconque prétendrait le contraire.",
    hooks: ["Tu rabaisses les autres.", "Tu listes tes accomplissements.", "Tu n'arrives pas à prouver ta supériorité."],
    questions: ["Quel domaine domines-tu ?", "Quels sont tes immenses accomplissements ?", "Quels rivaux végètent dans ton ombre ?", "Dans quels moments sombres doutes-tu de ta suprématie ?", "Qui t'a aidé à atteindre ton sommet ?"]
  },
  {
    name: "Yellow-Bellied",
    desc: "Ils t'ont traité de lâche. Le pire, c'est qu'ils n'ont pas tort.",
    hooks: ["Tu gardes tout pour toi.", "Tu rumines le pire qui pourrait arriver.", "Quelqu'un te traite de lâche, et il a raison."],
    questions: ["Pourquoi as-tu si peur ?", "Pour quel ami n'as-tu pas eu le courage de prendre la défense ?", "Quel idéal as-tu trahi par manque de force ?", "À qui as-tu tenté de tenir tête, et qu'est-ce que ça t'a coûté ?", "Qui a toujours pris ta défense, peu importe la situation ?"]
  }
];
