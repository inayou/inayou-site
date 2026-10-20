const fs=require('fs');const p='index.html';let s=fs.readFileSync(p,'utf8');const n0=s.length;
function cut(name,open){const i=s.indexOf(open);if(i<0){console.error('✗ '+name+': not found');process.exit(1);}
  const j=s.indexOf('</span>',i);if(j<0){console.error('✗ '+name+': no closing');process.exit(1);}
  let a=i; if(s[a-1]===' ')a--; s=s.slice(0,a)+s.slice(j+7); console.log('✓ '+name);}
function rep(name,re,to,expect){expect=expect==null?1:expect;
  const g=new RegExp(re.source,re.flags.includes('g')?re.flags:re.flags+'g');const c=(s.match(g)||[]).length;
  if(c!==expect){console.error('✗ '+name+': matched '+c+', expected '+expect);process.exit(1);}
  s=s.replace(re,to);console.log('✓ '+name);}
// 1) 푸터 '데모용 목업' 제거
cut('KO footer mock-note','<span class="mock-note">');
cut('EN dict mock-note','<span class=\\"mock-note\\">');
rep('mock-note css',/\n\s*\.mock-note\{[^}]*\}/,'');
rep('EN ft.copy',/"ft\.copy":"© 2026 INAYOU Inc\.\s*"/,'"ft.copy":"© 2026 INAYOU Inc. All rights reserved."');
// 4) 한술 푸터 링크 → hansool.io
rep('hansool footer link',/<a href="#b2c">한술 Hansool<\/a>/,'<a href="https://hansool.io" target="_blank" rel="noopener">한술 Hansool</a>');
// 3) Unimate 카드 → 수험생 대상(현 unimates.io). 입학처 B2B는 문의로 안내
rep('unimate desc KO',/(<p class="desc" data-i18n="card\.unimate\.d">)[\s\S]*?(<\/p>)/,'$1수험생이 성적표보다 먼저 &lsquo;뭘 좋아하는지&rsquo;로 어울리는 학과를 찾는 취향 기반 학과 추천 서비스. 12문항 취향 문답 &rarr; 나의 유형 &rarr; 학과&middot;대학 추천 (22 수록 학과 &middot; 16 취향 유형 &middot; 10 파트너 대학).$2');
rep('unimate kind KO',/(data-i18n="card\.unimate\.k">)[^<]*(<\/span>)/,'$1취향 기반 학과 추천$2');
rep('unimate desc EN',/"card\.unimate\.d":"[^"]*"/,'"card.unimate.d":"A taste-based major finder for students: discover the majors that fit you by what you enjoy — before your grades. 12-question taste quiz → your type → major & university matches (22 majors · 16 taste types · 10 partner universities)."');
rep('unimate kind EN',/"card\.unimate\.k":"[^"]*"/,'"card.unimate.k":"Taste-based major finder"');
rep('b2b more note',/(data-i18n="card\.unimate\.k">[^<]*<\/span><span class="go"[^>]*>[^<]*<\/span><\/div>\s*<\/a>\s*<\/div>)/,'$1\n    <p class="b2b-more" data-i18n="b2b.more">대학 입학처를 위한 <b>Unimate 입시 전환 솔루션</b>(AI 상담 &middot; 합격 예측 &middot; 리드 CRM)은 <a href="#contact" onclick="openInquiry(\'Unimate\');return false;">도입 문의</a>로 안내드립니다.</p>');
rep('b2b.more EN dict',/("card\.unimate\.k":"[^"]*",)/,'$1\n      "b2b.more":"For university admissions offices, the <b>Unimate admissions-conversion solution</b> (AI counseling · admission prediction · lead CRM) is available on request — <a href=\\"#contact\\" onclick=\\"openInquiry(\'Unimate\');return false;\\">contact us</a>.",');
rep('b2b-more css',/(\.cards\{[^}]*\})/,'$1\n  .b2b-more{margin-top:18px; font-size:.9rem; color:var(--slate); line-height:1.6}\n  .b2b-more a{color:var(--b2b); font-weight:600; text-decoration:underline; text-underline-offset:3px}');
// 2) EN 버튼 → 실제 /en/ 링크, 토글 핸들러 제거, hreflang
rep('EN button -> link',/<button class="lang-btn" id="langBtn" type="button">EN<\/button>/,'<a class="lang-btn" id="langBtn" href="/en/" hreflang="en" lang="en">EN</a>');
rep('lang-btn css for <a>',/\.lang-btn\{/,'.lang-btn{display:inline-block; text-decoration:none; ');
rep('remove toggle handler',/\n\s*langBtn\.addEventListener\('click'[^\n]*\n/,'\n');
rep('hreflang links',/(<link rel="canonical" href="https:\/\/inayou\.io\/">)/,'$1\n<link rel="alternate" hreflang="ko" href="https://inayou.io/">\n<link rel="alternate" hreflang="en" href="https://inayou.io/en/">\n<link rel="alternate" hreflang="x-default" href="https://inayou.io/">');
fs.writeFileSync(p,s);console.log('saved',n0,'->',s.length);
