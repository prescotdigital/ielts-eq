# IELTS EQ - Production Releases

## v1.2.0-blog-release (2025-12-06) ✅ CURRENT STABLE
**Status:** Known Good Production State

### Blog System - Complete
- ✅ Full-featured blog CMS (categories, tags, drafts, publishing)
- ✅ Admin interface for creating/editing posts
- ✅ Public blog listing with category filtering
- ✅ Individual post pages with SEO optimization
- ✅ Markdown content rendering with proper spacing
- ✅ View count tracking

### AI Content Writer - Cutting Edge
- ✅ Multi-step wizard (Idea → Titles → Excerpt → Content → Review)
- ✅ C1-C2 level English generation
- ✅ Anti-AI-detection techniques (no em-dashes, clichés avoided)
- ✅ Multiple writing styles (Notice, Publication, Editorial, Tutorial)
- ✅ Content length options (Short, Medium, Long)
- ✅ British spelling and academic punctuation

### AI Detection & Humanization - Industry Leading
- ✅ Multi-metric heuristic analysis (5 metrics)
  - Sentence length variance
  - Burstiness scoring
  - Transition density analysis
  - AI cliché detection
  - Passive voice ratio
- ✅ 3-pass humanization engine
  - Pass 1: Structural variation (fragments, questions, patterns)
  - Pass 2: Personality injection (contractions, asides, informal transitions)
  - Pass 3: Specificity enhancement (concrete examples, data)
- ✅ Before/after comparison UI
- ✅ Optional user examples for authenticity
- ✅ Real-time AI score display (0-100%)

### UX Enhancements
- ✅ Animated "Blog" button on homepage (wave effect on hover)
- ✅ Speaking-focused categories (Listening/Reading/Writing removed)
- ✅ Emerald green branding throughout
- ✅ Unsplash image recommendations

### Technical Stack
- Next.js 16.0.7 with Turbopack
- Prisma ORM with Neon PostgreSQL
- OpenAI GPT-4o and GPT-4o-mini
- NextAuth.js for authentication
- Tailwind CSS for styling
- Markdown rendering with ReactMarkdown

### Database Schema
- BlogPost (title, slug, content, featured image, publish status)
- BlogCategory (Speaking, General English)
- BlogTag (flexible tagging system)
- BlogDraft (AI writer state management)

### Known Issues
- None reported

### Performance
- Blog listing loads in <500ms
- AI content generation: 30-60 seconds
- AI humanization: 60-90 seconds
- Page load times optimized with static generation

### Security
- Admin-only access to blog management
- Input validation and sanitization
- SQL injection prevention via Prisma
- XSS protection in markdown rendering

---

## v1.1.0-login-tracking (2025-11-27)
**Status:** Stable
- Login attempt tracking and monitoring
- Failed login analytics
- Security dashboard

## v1.0.0-alpha (2025-11-24)
**Status:** Initial Production Release
- AI pronunciation feedback
- Vocabulary practice games
- Speaking test simulation
- User authentication

---

## Deployment Checklist for Future Releases

Before tagging a new production release:
- [ ] All tests passing
- [ ] No critical bugs in staging
- [ ] Database migrations successful
- [ ] Environment variables configured
- [ ] API keys validated
- [ ] Performance benchmarks met
- [ ] Security audit clean
- [ ] Documentation updated
- [ ] Git tag created with descriptive message
- [ ] Tag pushed to GitHub

## Rollback Procedure

If issues arise with current release:
```bash
# List available tags
git tag -l

# Rollback to previous stable version
git checkout v1.1.0-login-tracking

# Deploy to Vercel (triggers automatic deployment)
git push origin v1.1.0-login-tracking --force
```
