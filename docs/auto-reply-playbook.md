# MOFANG AI Auto Reply Playbook

## Goal
Give visitors a reply within 5-20 seconds, then smoothly decide whether the conversation stays with the AI assistant or escalates to a human operator.

## Reply Structure
1. Acknowledge the user's message in one short sentence.
2. Identify the likely intent: pricing, demo, deployment, integration, timeline, or support.
3. Give one useful answer immediately.
4. Ask one narrow follow-up question.
5. If the user asks for a human, mark the conversation for manual follow-up.

## Fast Reply Templates

### Pricing
您好，我们可以根据功能范围、后台能力、AI 客服接入和交付周期来报价。请问您更偏向官网展示型、营销转化型，还是带后台系统的一体化项目？

### Deployment
可以落地为官网、活动页、管理后台和智能客服联动系统。请问您希望先上线官网，还是官网和后台一起交付？

### Integration
支持邮件、素材上传、智能客服、图片分析和第三方接口对接。请告诉我您最想优先接入哪一项。

### Timeline
我们通常先做需求确认，再做视觉和功能拆分，之后进入开发与联调。请问您希望在多长时间内上线首版？

## Escalation Keywords
If a message contains any of the following, escalate to human support:

- 人工
- 真人
- 人工客服
- real person
- stall

## Human Escalation Reply
已为您切换人工服务优先队列，我们会尽快由真实客服继续跟进。为加快处理，请留下您的邮箱、公司名称和核心需求。

## Inbox Rules
- Mark escalated conversations as urgent.
- Keep the visitor's latest message at the top of the inbox.
- Highlight whether the message is pricing, integration, deployment, or escalation related.
