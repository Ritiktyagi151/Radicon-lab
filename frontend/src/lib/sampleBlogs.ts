import type { Blog } from '@/types/blog'

export const sampleBlogs: Blog[] = [
  {
    title: 'Quality Testing Standards for Modern Pharmaceutical Manufacturing',
    slug: 'quality-testing-standards-pharmaceutical-manufacturing',
    excerpt:
      'A practical look at how disciplined laboratory workflows, documentation, and validated processes support safer pharma production.',
    content: `## Building consistency into every batch

Reliable pharmaceutical manufacturing depends on controlled testing, clear specifications, and repeatable documentation. Every batch should move through a traceable process that makes quality visible before release.

## Why validated methods matter

Validated analytical methods reduce ambiguity. They help teams compare results confidently, identify drift early, and keep production aligned with regulatory expectations.

> Quality is strongest when it is designed into the workflow, not inspected only at the end.

## Core checkpoints

- Raw material verification
- In-process quality checks
- Stability observations
- Finished product review

## Example record structure

\`\`\`txt
Batch ID
Test parameter
Acceptance criteria
Observed value
Reviewer sign-off
\`\`\`

## The operational advantage

When teams maintain consistent records and calibrated equipment, decisions become faster and more defensible. That discipline supports both compliance and customer confidence.`,
    featuredImage:
      'https://images.unsplash.com/photo-1581093458791-9f3c3250bb8b?q=80&w=1600&auto=format&fit=crop',
    category: 'Quality',
    tags: ['Testing', 'Manufacturing', 'Compliance'],
    author: 'Radicon Lab Team',
    seoTitle: 'Quality Testing Standards for Pharma Manufacturing',
    seoDescription:
      'Explore quality testing standards and validated workflows for pharmaceutical manufacturing.',
    status: 'published',
    readTime: '5 min read',
    createdAt: '2026-02-20T09:00:00.000Z',
  },
  {
    title: 'How Third Party Pharma Manufacturing Supports Faster Scale',
    slug: 'third-party-pharma-manufacturing-scale',
    excerpt:
      'Learn how specialized manufacturing partners help brands expand capacity while keeping attention on formulation, compliance, and delivery.',
    content: `## Scaling with the right partner

Third party manufacturing gives pharma businesses access to established production systems without building every capability from the ground up.

## What to evaluate

- Facility capability
- Documentation maturity
- Quality control process
- Communication rhythm

## Better planning, fewer delays

A strong manufacturing partner helps align procurement, production planning, and testing timelines so launches stay predictable.`,
    featuredImage:
      'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=1600&auto=format&fit=crop',
    category: 'Manufacturing',
    tags: ['Third Party', 'Production'],
    author: 'Radicon Lab Team',
    status: 'published',
    readTime: '4 min read',
    createdAt: '2026-01-28T09:00:00.000Z',
  },
  {
    title: 'Improving Product Confidence Through Laboratory Documentation',
    slug: 'laboratory-documentation-product-confidence',
    excerpt:
      'Good documentation turns technical work into trusted evidence that supports reviews, audits, and long-term product reliability.',
    content: `## Documentation is part of quality

Strong records make laboratory work reviewable and repeatable. They also help teams understand what happened, when it happened, and who approved it.

## Useful documentation habits

- Keep observations specific
- Record deviations immediately
- Attach method references
- Review before release

## A more transparent process

When documentation is clear, every stakeholder can trace product decisions with confidence.`,
    featuredImage:
      'https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=1600&auto=format&fit=crop',
    category: 'Research',
    tags: ['Laboratory', 'Documentation'],
    author: 'Radicon Lab Team',
    status: 'published',
    readTime: '3 min read',
    createdAt: '2025-12-18T09:00:00.000Z',
  },
  {
    title: 'Practical Considerations for Stable Pharma Supply Chains',
    slug: 'stable-pharma-supply-chains',
    excerpt:
      'A resilient supply chain combines dependable vendor qualification, realistic lead times, and quality checks that catch issues early.',
    content: `## Resilience starts before production

Stable supply chains are planned around qualified vendors, realistic buffers, and transparent communication.

## Areas to monitor

- Material availability
- Vendor quality history
- Storage conditions
- Dispatch timelines

## Keeping production dependable

The best supply chain plans make delays visible early enough for teams to act.`,
    featuredImage:
      'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?q=80&w=1600&auto=format&fit=crop',
    category: 'Operations',
    tags: ['Supply Chain', 'Planning'],
    author: 'Radicon Lab Team',
    status: 'published',
    readTime: '4 min read',
    createdAt: '2025-11-08T09:00:00.000Z',
  },
]

export const blogCategories = ['All', ...Array.from(new Set(sampleBlogs.map((blog) => blog.category)))]
