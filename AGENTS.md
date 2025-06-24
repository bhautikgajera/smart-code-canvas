# Git Management Agents

## Branch Management Agent

यह एजेंट Git repository और branches के management की जिम्मेदारी संभालता है।

### मुख्य कार्य

1. **Branch Creation और Tracking**
   - नई branch बनाते समय `origin_tracking.md` फाइल को अपडेट करना आवश्यक है
   - हर नई branch की जानकारी track रखना जैसे: creation date, creator, और purpose
   - Remote branch और local branch के बीच सिंक्रोनाइज़ेशन सुनिश्चित करना

2. **Branch Workflow Management**
   - Feature branches का प्रबंधन
   - Pull requests और code reviews का प्रबंधन
   - Merge conflicts को सुलझाना

3. **Origin Tracking Instructions**
   - सभी contributors को branch बनाने के बाद `origin_tracking.md` फाइल अपडेट करने का निर्देश देना
   - फाइल में निम्न जानकारी शामिल करना:
     - Branch name
     - Creation date
     - Creator name
     - Description/purpose
   - Remote branches की स्थिति की नियमित निगरानी करना

### `origin_tracking.md` का महत्व

`origin_tracking.md` फाइल repository में सभी branches का centralized documentation है जो:

1. टीम के सदस्यों को current branch structure का overview देता है
2. Repository history को track करने में मदद करता है
3. Project management को सुविधाजनक बनाता है
4. Branch naming conventions और workflows को standardize करता है

### Branch बनाने की प्रक्रिया

```bash
# 1. नई branch बनाएं
git checkout -b branch-name

# 2. origin_tracking.md फाइल अपडेट करें
# Branch की जानकारी जोड़ें

# 3. Changes को commit करें
git add origin_tracking.md
git commit -m "Update branch tracking information for branch-name"

# 4. Remote पर push करें
git push -u origin branch-name
```

## Git Workflow Standards

1. **Branch Naming Convention**
   - feature/feature-name: नए features के लिए
   - bugfix/bug-description: बग फिक्स के लिए
   - hotfix/issue-description: क्रिटिकल फिक्स के लिए
   - release/version: रिलीज़ के लिए

2. **Commit Message Format**
   - type: description
   - type: feat, fix, docs, style, refactor, test, chore

3. **Workflow Steps**
   - Branch create करें
   - `origin_tracking.md` अपडेट करें
   - Changes implement करें
   - Pull request बनाएं
   - Code review करवाएं
   - Main में merge करें