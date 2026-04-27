window.SEED = {
  clubs: [
    {
      id: 'club-1',
      name: 'Metro United SC',
      city: 'Austin',
      state: 'TX',
      zip: '78701',
      website: 'https://example.com/metro',
      phone: '(555) 555-1000',
      email: 'info@metrounited.example',
      logo: '',
      leagues: ['ECNL', 'MLS NEXT'],
      genders: ['Boys', 'Girls'],
      ages: ['U11', 'U12', 'U13', 'U14', 'U15', 'U16', 'U17', 'U18', 'U19'],
      tryoutInfo: 'Tryouts start May 15.',
      registrationLink: 'https://example.com/metro/tryouts',
      description: 'Competitive youth club focused on long-term player development.',
      social: { instagram: '#', facebook: '#' },
      rating: 4.4
    },
    {
      id: 'club-2',
      name: 'Lakeview FC',
      city: 'Columbus',
      state: 'OH',
      zip: '43004',
      website: 'https://example.com/lakeview',
      phone: '(555) 555-2000',
      email: 'hello@lakeview.example',
      logo: '',
      leagues: ['NPL', 'USYS', 'Local/Other'],
      genders: ['Coed'],
      ages: ['U8', 'U9', 'U10', 'U11', 'U12', 'U13', 'U14'],
      tryoutInfo: 'Rolling evaluations every month.',
      registrationLink: 'https://example.com/lakeview/register',
      description: 'Family-first club with strong coaching standards and clear communication.',
      social: { x: '#', facebook: '#' },
      rating: 4.1
    }
  ],
  coaches: [
    {
      id: 'coach-1',
      name: 'Jordan Ellis',
      clubId: 'club-1',
      club: 'Metro United SC',
      city: 'Austin',
      state: 'TX',
      bio: 'USSF B licensed coach with 10 years in elite youth pathways.',
      ages: ['U14', 'U15', 'U16'],
      leagues: ['ECNL'],
      genders: ['Girls'],
      contact: { linkedin: '#' },
      rating: 4.6
    },
    {
      id: 'coach-2',
      name: 'Casey Morgan',
      clubId: 'club-2',
      club: 'Lakeview FC',
      city: 'Columbus',
      state: 'OH',
      bio: 'Former college player focused on technical and confidence development.',
      ages: ['U10', 'U11', 'U12'],
      leagues: ['USYS'],
      genders: ['Coed'],
      contact: { instagram: '#' },
      rating: 4.2
    }
  ]
};
