/******************************************************************************
 * Spine Runtimes License Agreement
 * Last updated January 1, 2020. Replaces all prior versions.
 *
 * Copyright (c) 2013-2020, Esoteric Software LLC
 *
 * Integration of the Spine Runtimes into software or otherwise creating
 * derivative works of the Spine Runtimes is permitted under the terms and
 * conditions of Section 2 of the Spine Editor License Agreement:
 * http://esotericsoftware.com/spine-editor-license
 *
 * Otherwise, it is permitted to integrate the Spine Runtimes into software
 * or otherwise create derivative works of the Spine Runtimes (collectively,
 * "Products"), provided that each user of the Products must obtain their own
 * Spine Editor license and redistribution of the Products in any form must
 * include this license and copyright notice.
 *
 * THE SPINE RUNTIMES ARE PROVIDED BY ESOTERIC SOFTWARE LLC "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL ESOTERIC SOFTWARE LLC BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES,
 * BUSINESS INTERRUPTION, OR LOSS OF USE, DATA, OR PROFITS) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
 * THE SPINE RUNTIMES, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *****************************************************************************/

#ifdef SPINE_UE4
#include "SpinePluginPrivatePCH.h"
#endif

#include <spine/Skin.h>

#include <spine/Attachment.h>
#include <spine/MeshAttachment.h>
#include <spine/Skeleton.h>

#include <spine/Slot.h>
#include <spine/ConstraintData.h>

#include <assert.h>

using namespace spine;

Skin::AttachmentMap::AttachmentMap() {
}

static void disposeAttachment(Attachment* attachment) {
	if (!attachment) return;
	attachment->dereference();
	if (attachment->getRefCount() == 0) delete attachment;
}

void Skin::AttachmentMap::put(size_t slotIndex, const String &attachmentName, Attachment *attachment,const String & cacheName /*= nullptr*/) {
	if (slotIndex >= _buckets.size())
		_buckets.setSize(slotIndex + 1, Vector<Entry>());
	Vector<Entry> &bucket = _buckets[slotIndex];
	int existing = findInBucket(bucket, attachmentName,cacheName);
	attachment->reference();
	if (existing >= 0) {
		disposeAttachment(bucket[existing]._attachment);
		bucket[existing]._attachment = attachment;
	} else {
        if(cacheName != nullptr)
        {
            bucket.add(Entry(slotIndex, attachmentName, attachment, cacheName));
        }
		else
        {
            bucket.add(Entry(slotIndex, attachmentName, attachment));
        }
	}
}

Attachment *Skin::AttachmentMap::get(size_t slotIndex, const String &attachmentName,const String & cacheName /*= nullptr*/)
{
	if (slotIndex >= _buckets.size()) return NULL;
	int existing = findInBucket(_buckets[slotIndex], attachmentName, cacheName);
	return existing >= 0 ? _buckets[slotIndex][existing]._attachment : NULL;
}

void Skin::AttachmentMap::remove(size_t slotIndex)
{
    auto bucket = _buckets[slotIndex];
    for (size_t i = 0; i < bucket.size(); i++){
        disposeAttachment(bucket[i]._attachment);
    }
    
    _buckets[slotIndex].clear();
}

void Skin::AttachmentMap::remove(size_t slotIndex, const String &attachmentName, const String & cacheName /*= nullptr*/) {
	if (slotIndex >= _buckets.size()) return;
	int existing = findInBucket(_buckets[slotIndex],attachmentName,cacheName);
	if (existing >= 0) {
		disposeAttachment(_buckets[slotIndex][existing]._attachment);
		_buckets[slotIndex].removeAt(existing);
	}
}

bool Skin::AttachmentMap::activateAttachment(size_t slotIndex, const String &attachmentName, const String & cacheName)
{
    if (slotIndex >= _buckets.size())
    {
        return false;
    }
    
    return activate(_buckets[slotIndex], attachmentName, cacheName);
}

bool Skin::AttachmentMap::activate(Vector <Entry> &bucket, const String &attachmentName,const String & cacheName)
{
    int index = findInBucket(bucket,attachmentName,cacheName);
    if (index > 0) {
        auto temp = bucket[index];
        bucket[index] = bucket[0];
        bucket[0] = temp;
    }
    return true;
}

int Skin::AttachmentMap::findInBucket(Vector<Entry> &bucket, const String &attachmentName,const String & cacheName /*= nullptr*/) {
    if(cacheName != nullptr)
    {
        for (size_t i = 0; i < bucket.size(); i++){
           if (bucket[i]._name == attachmentName && bucket[i]._cacheName == cacheName) return (int)i;
        }
    }
    else
    {
        for (size_t i = 0; i < bucket.size(); i++){
           if (bucket[i]._name == attachmentName) return (int)i;
        }
    }
	
	return -1;
}

Skin::AttachmentMap::Entries Skin::AttachmentMap::getEntries() {
	return Skin::AttachmentMap::Entries(_buckets);
}

Skin::Skin(const String &name) : _name(name), _attachments() {
	assert(_name.length() > 0);
}

Skin::~Skin() {
	Skin::AttachmentMap::Entries entries = _attachments.getEntries();
	while (entries.hasNext()) {
		Skin::AttachmentMap::Entry entry = entries.next();
		disposeAttachment(entry._attachment);
	}
}

void Skin::setAttachment(size_t slotIndex, const String &name, Attachment *attachment) {
	assert(attachment);
	_attachments.put(slotIndex, name, attachment);
}

Attachment *Skin::getAttachment(size_t slotIndex, const String &name) {
	return _attachments.get(slotIndex, name);
}

void Skin::removeAttachment(size_t slotIndex, const String& name) {
	_attachments.remove(slotIndex, name);
}

void Skin::findNamesForSlot(size_t slotIndex, Vector<String> &names) {
	Skin::AttachmentMap::Entries entries = _attachments.getEntries();
	while (entries.hasNext()) {
		Skin::AttachmentMap::Entry &entry = entries.next();
		if (entry._slotIndex == slotIndex) {
			names.add(entry._name);
		}
	}
}

void Skin::findAttachmentsForSlot(size_t slotIndex, Vector<Attachment *> &attachments) {
	Skin::AttachmentMap::Entries entries = _attachments.getEntries();
	while (entries.hasNext()) {
		Skin::AttachmentMap::Entry &entry = entries.next();
		if (entry._slotIndex == slotIndex) attachments.add(entry._attachment);
	}
}

const String &Skin::getName() {
	return _name;
}

Skin::AttachmentMap::Entries Skin::getAttachments() {
	return _attachments.getEntries();
}

void Skin::attachAll(Skeleton &skeleton, Skin &oldSkin) {
	Vector<Slot *> &slots = skeleton.getSlots();
	Skin::AttachmentMap::Entries entries = oldSkin.getAttachments();
	while (entries.hasNext()) {
		Skin::AttachmentMap::Entry &entry = entries.next();
		int slotIndex = entry._slotIndex;
		Slot *slot = slots[slotIndex];

		if (slot->getAttachment() == entry._attachment) {
			Attachment *attachment = getAttachment(slotIndex, entry._name);
			if (attachment) slot->setAttachment(attachment);
		}
	}
}

void Skin::addSkin(Skin* other) {
	for (size_t i = 0; i < other->getBones().size(); i++)
		if (!_bones.contains(other->getBones()[i])) _bones.add(other->getBones()[i]);

	for (size_t i = 0; i < other->getConstraints().size(); i++)
		if (!_constraints.contains(other->getConstraints()[i])) _constraints.add(other->getConstraints()[i]);

	AttachmentMap::Entries entries = other->getAttachments();
	while(entries.hasNext()) {
		AttachmentMap::Entry& entry = entries.next();
		setAttachment(entry._slotIndex, entry._name, entry._attachment);
	}
}

void Skin::copySkin(Skin* other) {
	for (size_t i = 0; i < other->getBones().size(); i++)
		if (!_bones.contains(other->getBones()[i])) _bones.add(other->getBones()[i]);

	for (size_t i = 0; i < other->getConstraints().size(); i++)
		if (!_constraints.contains(other->getConstraints()[i])) _constraints.add(other->getConstraints()[i]);

	AttachmentMap::Entries entries = other->getAttachments();
	while(entries.hasNext()) {
		AttachmentMap::Entry& entry = entries.next();
		if (entry._attachment->getRTTI().isExactly(MeshAttachment::rtti))
			setAttachment(entry._slotIndex, entry._name, static_cast<MeshAttachment*>(entry._attachment)->newLinkedMesh());
		else
			setAttachment(entry._slotIndex, entry._name, entry._attachment->copy());
	}
}

Vector<ConstraintData*>& Skin::getConstraints() {
	return _constraints;
}

Vector<BoneData*>& Skin::getBones() {
	return _bones;
}

void Skin::removeAttachmentByCache()
{
    Skin::AttachmentMap::Entries entries = _attachments.getEntries();
    while (entries.hasNext()) {
        Skin::AttachmentMap::Entry &entry = entries.next();
        _attachments.remove(entry._slotIndex);
    }
}

//将替换的组件，加入缓存
void Skin::addAttachmentToCache (int slotIndex, const String &name, Attachment* attachment, const String &cacheName)
{
    assert(attachment);
    _attachments.put(slotIndex, name, attachment,cacheName);
    
    //激活组件
    activateAttachmentByCache(cacheName);
}

//缓存中是否存在该组件
Attachment* Skin::getAttachmentByCache (const String &name)
{
    size_t slotIndex = -1;
    String attachmentName = "";
    
    Skin::AttachmentMap::Entries entries = _attachments.getEntries();
    while (entries.hasNext()) {
        Skin::AttachmentMap::Entry &entry = entries.next();
        if (entry._cacheName == name) {
            slotIndex = entry._slotIndex;
            attachmentName = entry._name;
            break;
        }
    }
    
    if (slotIndex == -1 && attachmentName.isEmpty()) {
        return nullptr;
    }
    
    return _attachments.get(slotIndex, attachmentName, name);
}

//激活缓存中的组件
void Skin::activateAttachmentByCache(const String &name)
{
    size_t slotIndex = -1;
    String attachmentName = "";
    
    Skin::AttachmentMap::Entries entries = _attachments.getEntries();
    while (entries.hasNext()) {
        Skin::AttachmentMap::Entry &entry = entries.next();
        if (entry._cacheName == name) {
            slotIndex = entry._slotIndex;
            attachmentName = entry._name;
            break;
        }
        
    }
    
    if (slotIndex == -1 && attachmentName.isEmpty()) {
        return;
    }
    _attachments.activateAttachment(slotIndex, attachmentName, name);
}

