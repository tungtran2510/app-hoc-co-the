/**
 * Imaging & Clinical Correlation Data Store (LỆNH #09)
 * Medical Modalities: X-ray, CT Scanner, MRI, Ultrasound, Gross Cross-section.
 * Correlative Anatomy: Image hotspot mapping to 3D mesh, Synchronized Clipping Planes,
 * Clinical Case Studies, Pathological Mechanisms & Academic Disclaimers.
 */

export type ImagingModality = 'xray' | 'ct' | 'mri' | 'ultrasound' | 'cross_section';

export interface ImageAnnotationHotspot {
  id: string;
  x: number; // percentage from left 0-100
  y: number; // percentage from top 0-100
  label: string;
  partId: string;
  partNameVi: string;
  nameLatin: string;
  system: string;
  clinicalSignificance: string;
}

export interface ClinicalCase {
  id: string;
  title: string;
  modality: ImagingModality;
  modalityName: string;
  region: 'head_neck' | 'thorax' | 'abdomen' | 'spine' | 'lower_limb' | 'upper_limb' | 'pelvis';
  regionName: string;
  targetPartId: string;
  targetPartNameVi: string;
  nameLatin: string;
  targetSystem: string;
  plane: 'axial' | 'sagittal' | 'coronal';
  sliceDepthCm: number;
  view3DHash: string;
  patientHistory: string;
  symptoms: string[];
  imagingFindings: string;
  anatomicalCorrelation: string;
  commonPitfalls: string;
  hotspots: ImageAnnotationHotspot[];
  clinicalQuiz: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

export const MEDICAL_ACADEMIC_DISCLAIMER = {
  title: 'TUYÊN BỐ MIỄN TRỪ VÀ GIỚI HẠN PHẠM VI HỌC THUẬT',
  content:
    'Toàn bộ hình ảnh X-quang, CT, MRI, siêu âm, lát cắt giải phẫu và các ca bệnh trên nền tảng chỉ phục vụ mục đích giảng dạy, đào tạo học thuật và nghiên cứu đối chiếu hình thái giải phẫu cho sinh viên và nhân viên y tế. Tuyệt đối KHÔNG sử dụng làm căn cứ chẩn đoán, tự điều trị hay chỉ định y khoa cho bất kỳ trường hợp bệnh nhân cá nhân cụ thể nào. Mọi vấn đề sức khỏe thực tế bắt buộc phải được thăm khám trực tiếp tại các cơ sở y tế chuyên khoa được cấp phép.'
};

export const CLINICAL_CASES: ClinicalCase[] = [
  {
    id: 'case_femur_neck_fracture',
    title: 'Ca 1: Gãy cổ xương đùi ở người cao tuổi loãng xương',
    modality: 'xray',
    modalityName: 'X-quang Khung chậu & Khớp háng (Pelvis X-ray AP)',
    region: 'lower_limb',
    regionName: 'Chi dưới & Khớp háng',
    targetPartId: 'femur',
    targetPartNameVi: 'Xương đùi (Cổ xương đùi)',
    nameLatin: 'Collum ossis femoris',
    targetSystem: 'skeletal',
    plane: 'coronal',
    sliceDepthCm: 15.0,
    view3DHash: '#sys=skeletal&cam=0.18,0.92,1.85,0,0.85,0&sel=femur&iso=femur',
    patientHistory:
      'Bệnh nhân nữ, 74 tuổi, tiền sử loãng xương nhiều năm. Trượt ngã đập mông phải xuống sàn cứng. Sau ngã đau chói dữ dội vùng háng phải, hoàn toàn không thể đứng dậy hoặc cử động chân.',
    symptoms: [
      'Chân phải biến dạng điển hình: ngắn chi và bàn chân xoay ngoài áp sát mặt giường',
      'Đau chói dữ dội khi ấn tam giác bẹn (Scarpa) hoặc khi gõ dồn lực từ gót chân lên',
      'Mất hoàn toàn cơ chế vận động chủ động của chi dưới phải'
    ],
    imagingFindings:
      'Phim X-quang tư thế thẳng (AP) cho thấy đường gãy thấu cổ giải phẫu xương đùi phải; các bè xương vùng cổ bị gián đoạn; cung Shenton (đường cong liên tục giữa bờ dưới cổ đùi và bờ trên lỗ bịt) bị gãy khúc mất liên tục.',
    anatomicalCorrelation:
      'Vùng cổ và chỏm xương đùi được cấp máu chủ yếu bởi các nhánh của động mạch mũ đùi trong (thuộc ĐM đùi sâu) chạy ngược dòng bọc sát bao khớp. Khi gãy cổ xương đùi di lệch, các mạch máu nuôi dưỡng này rất dễ bị đứt hoặc bầm giập, dẫn đến biến chứng nguy hiểm nhất là Hoại tử vô mạch chỏm xương đùi (Avascular Necrosis - AVN). Do đó, ở người cao tuổi thường có chỉ định thay khớp háng bán phần hoặc toàn phần thay vì kết hợp xương.',
    commonPitfalls:
      'Tránh nhầm lẫn gãy cổ xương đùi với gãy liên mấu chuyển. Gãy liên mấu chuyển nằm ngoài bao khớp có hệ thống mạch máu nuôi dồi dào hơn và ít có nguy cơ hoại tử chỏm xương.',
    hotspots: [
      {
        id: 'hs_femur_head',
        x: 48,
        y: 35,
        label: 'Chỏm xương đùi (Caput femoris)',
        partId: 'femur',
        partNameVi: 'Chỏm xương đùi',
        nameLatin: 'Caput ossis femoris',
        system: 'skeletal',
        clinicalSignificance: 'Nơi tiếp khớp với ổ cối xương chậu; nguy cơ thiếu máu hoại tử cao khi gãy cổ.'
      },
      {
        id: 'hs_femur_fracture_line',
        x: 52,
        y: 44,
        label: 'Vị trí đường gãy cổ xương đùi',
        partId: 'femur',
        partNameVi: 'Cổ xương đùi',
        nameLatin: 'Collum femoris',
        system: 'skeletal',
        clinicalSignificance: 'Đường gãy làm gián đoạn cung Shenton và các nhánh mạch nuôi mũ đùi trong.'
      },
      {
        id: 'hs_greater_trochanter',
        x: 62,
        y: 50,
        label: 'Mấu chuyển lớn (Trochanter major)',
        partId: 'femur',
        partNameVi: 'Mấu chuyển lớn',
        nameLatin: 'Trochanter major',
        system: 'skeletal',
        clinicalSignificance: 'Mốc giải phẫu nông dưới da; nơi bám tận của cơ mông nhỡ và cơ mông bé.'
      }
    ],
    clinicalQuiz: {
      question:
        'Cơ chế giải phẫu nào giải thích tại sao gãy cổ xương đùi di lệch lại có nguy cơ cao dẫn đến hoại tử vô mạch chỏm xương?',
      options: [
        'Do bao khớp háng quá dày ngăn cản oxy khuếch tán',
        'Do đứt rách các nhánh động mạch mũ đùi trong chạy dọc cổ nuôi dưỡng chỏm',
        'Do áp lực dây thần kinh ngồi đè ép vào tủy xương',
        'Do thiếu canxi tại vị trí tiếp khớp ổ cối'
      ],
      correctIndex: 1,
      explanation:
        'Chỏm xương đùi nhận nguồn máu chính từ các nhánh động mạch mũ đùi trong đi ngược lên qua bao khớp. Gãy di lệch xé rách hệ mạch này gây thiếu máu cục bộ hoại tử chỏm.'
    }
  },
  {
    id: 'case_lumbar_disc_herniation',
    title: 'Ca 2: Thoát vị đĩa đệm cột sống thắt lưng L4-L5 chèn ép rễ thần kinh L5',
    modality: 'mri',
    modalityName: 'Cộng hưởng từ Cột sống Thắt lưng (Lumbar Spine MRI T2)',
    region: 'spine',
    regionName: 'Cột sống thắt lưng',
    targetPartId: 'spine',
    targetPartNameVi: 'Cột sống & Đĩa đệm L4-L5',
    nameLatin: 'Discus intervertebralis L4-L5',
    targetSystem: 'skeletal',
    plane: 'sagittal',
    sliceDepthCm: 0.0,
    view3DHash: '#sys=skeletal,nervous&sel=vertebra_lumbar_5&iso=vertebra_lumbar_5',
    patientHistory:
      'Bệnh nhân nam, 43 tuổi, kỹ sư xây dựng. Sau khi cúi khom người nâng kiện hàng nặng đột ngột nghe tiếng "khục" ở thắt lưng, sau đó đau dữ dội lan nhanh xuống chân trái.',
    symptoms: [
      'Đau thắt lưng lan dọc mặt sau ngoài đùi, cẳng chân xuống tận mu bàn chân và ngón chân cái (hội chứng đau thần kinh tọa)',
      'Tê bì, dị cảm cảm giác châm chích vùng mu bàn chân trái',
      'Nghiệm pháp Lasègue (nâng thẳng chân) chân trái dương tính ở 30°',
      'Yếu cơ duỗi dài ngón chân cái; đi bằng gót chân khó khăn'
    ],
    imagingFindings:
      'Trên phim MRI chuỗi xung T2 Sagittal và Axial: Đĩa đệm gian đốt L4-L5 thoái hóa mất nước (giảm tín hiệu màu tối); rách vòng xơ sau; khối nhân nhầy (nucleus pulposus) thoát vị lồi ra sau lệch trái khoảng 7mm chèn ép rõ rệt vào bao màng cứng và rễ thần kinh L5 bên trái.',
    anatomicalCorrelation:
      'Dây chằng dọc sau (Posterior Longitudinal Ligament) ở vùng thắt lưng có cấu trúc thon hẹp dần về phía dưới, tạo điểm yếu giải phẫu ở góc sau - bên đĩa đệm. Khi chịu tải trọng uốn cong, nhân nhầy dễ thoát vị qua lỗ hổng này đè ép trực tiếp lên rễ thần kinh gai sống đi qua ngách bên, gây nên triệu chứng thần kinh chi phối tương ứng.',
    commonPitfalls:
      'Cần phân biệt chèn ép rễ L5 (yếu gấp mu ngón cái, đau mu chân) với rễ S1 (giảm phản xạ gân gót, yếu gấp lòng bàn chân, đi bằng đầu ngón chân khó khăn).',
    hotspots: [
      {
        id: 'hs_vertebra_l4',
        x: 44,
        y: 38,
        label: 'Thân đốt sống thắt lưng L4',
        partId: 'spine',
        partNameVi: 'Đốt sống L4',
        nameLatin: 'Vertebra lumbalis IV',
        system: 'skeletal',
        clinicalSignificance: 'Chịu lực trục đứng chính của thân mình.'
      },
      {
        id: 'hs_herniated_disc',
        x: 49,
        y: 46,
        label: 'Khối nhân nhầy thoát vị L4-L5',
        partId: 'spine',
        partNameVi: 'Đĩa đệm L4-L5',
        nameLatin: 'Hernia disci L4-L5',
        system: 'skeletal',
        clinicalSignificance: 'Chèn ép trực tiếp rễ thần kinh L5 trong ngách bên ống sống.'
      },
      {
        id: 'hs_spinal_cord',
        x: 55,
        y: 45,
        label: 'Ống sống & Chùm đuôi ngựa',
        partId: 'nervous',
        partNameVi: 'Chùm đuôi ngựa',
        nameLatin: 'Cauda equina',
        system: 'nervous',
        clinicalSignificance: 'Chứa các rễ thần kinh tủy thắt lưng - cùng sau khi nón tủy kết thúc ở L1-L2.'
      }
    ],
    clinicalQuiz: {
      question:
        'Dấu hiệu bệnh nhân yếu động tác gấp mu ngón chân cái và đi lại bằng gót chân khó khăn phản ánh rễ thần kinh tủy sống nào bị chèn ép?',
      options: ['Rễ thần kinh L3', 'Rễ thần kinh L4', 'Rễ thần kinh L5', 'Rễ thần kinh S1'],
      correctIndex: 2,
      explanation:
        'Cơ duỗi dài ngón cái (Extensor hallucis longus) và cơ chày trước được chi phối ưu thế bởi rễ thần kinh thắt lưng L5. Tổn thương rễ L5 gây yếu nhấc mũi chân và ngón cái.'
    }
  },
  {
    id: 'case_tension_pneumothorax',
    title: 'Ca 3: Tràn khí màng phổi áp lực & Xẹp phổi cấp tính',
    modality: 'ct',
    modalityName: 'Cắt lớp vi tính Lồng ngực (Chest CT Axial Window)',
    region: 'thorax',
    regionName: 'Lồng ngực & Phổi',
    targetPartId: 'visceral',
    targetPartNameVi: 'Phổi & Khoang màng phổi',
    nameLatin: 'Cavitas pleuralis & Pulmo',
    targetSystem: 'visceral',
    plane: 'axial',
    sliceDepthCm: 22.0,
    view3DHash: '#sys=visceral,skeletal&cam=0,1.2,2.0,0,1.1,0',
    patientHistory:
      'Bệnh nhân nam, 29 tuổi, tai nạn giao thông xe máy va chạm mạnh ngực phải vào dải phân cách. Nhập viện cấp cứu trong tình trạng tím tái môi đầu chi, khó thở dữ dội, huyết áp tụt 80/50 mmHg.',
    symptoms: [
      'Suy hô hấp cấp tính: thở ngực nghịch thường, co kéo cơ ức đòn chũm và liên sườn',
      'Lồng ngực bên phải căng vồng bất động, gõ vang trống toàn bộ trường phổi',
      'Rì rào phế nang phổi phải biến mất hoàn toàn',
      'Tĩnh mạch cổ nổi to phồng, huyết áp tụt sâu (dấu hiệu sốc tắc nghẽn do cản trở tuần hoàn)'
    ],
    imagingFindings:
      'Trên phim CT lồng ngực lát cắt ngang (Axial): Toàn bộ khoang màng phổi phải chứa đầy khí đậm độ rất thấp (màu đen hoàn toàn), nhu mô phổi phải bị ép xẹp thụ động hoàn toàn về phía rốn phổi; trung thất, khí quản và bóng tim bị đẩy lệch dữ dội sang bên trái.',
    anatomicalCorrelation:
      'Cơ chế van một chiều do lá thành hoặc lá tạng màng phổi bị rách: không khí tràn vào khoang màng phổi trong thì hít vào nhưng không thoát ra được trong thì thở ra -> Áp lực trong khoang màng phổi ngày càng tăng cao hơn áp lực khí quyển -> Đè ép xẹp hoàn toàn tĩnh mạch chủ trên và tĩnh mạch chủ dưới -> Máu không thể hồi lưu về tâm nhĩ phải -> Cung lượng tim tụt dốc gây trụy tim mạch tử vong nhanh chóng nếu không được chọc kim giải áp cấp cứu.',
    commonPitfalls:
      'Tràn khí màng phổi áp lực là một cấp cứu lâm sàng tuyệt đối: Bắt buộc chọc kim giải áp ngay lập tức tại khoang liên sườn 2 đường giữa đòn hoặc liên sườn 5 đường nách trước, KHÔNG được trì hoãn chờ chụp phim X-quang/CT.',
    hotspots: [
      {
        id: 'hs_pneumo_air',
        x: 35,
        y: 42,
        label: 'Khí áp lực cao trong khoang màng phổi phải',
        partId: 'visceral',
        partNameVi: 'Khoang màng phổi phải',
        nameLatin: 'Cavitas pleuralis dextra',
        system: 'visceral',
        clinicalSignificance: 'Mất hoàn toàn vân phổi; đè ép mô phổi lành.'
      },
      {
        id: 'hs_collapsed_lung',
        x: 48,
        y: 48,
        label: 'Nhu mô phổi phải bị xẹp thụ động',
        partId: 'visceral',
        partNameVi: 'Phổi phải xẹp',
        nameLatin: 'Atelectasis pulmonis',
        system: 'visceral',
        clinicalSignificance: 'Nhu mô phổi co cụm lại sát rốn phổi, mất trao đổi khí.'
      },
      {
        id: 'hs_mediastinal_shift',
        x: 60,
        y: 45,
        label: 'Trung thất & Tim bị đẩy lệch sang trái',
        partId: 'cardiovascular',
        partNameVi: 'Trung thất lệch',
        nameLatin: 'Deviatio mediastini',
        system: 'cardiovascular',
        clinicalSignificance: 'Gập góc và chèn ép tĩnh mạch chủ gây sốc tắc nghẽn.'
      }
    ],
    clinicalQuiz: {
      question:
        'Tại sao tràn khí màng phổi áp lực lại dẫn đến tụt huyết áp và đe dọa ngừng tuần hoàn nhanh chóng?',
      options: [
        'Do khí tràn vào chèn ép động mạch phổi gây tăng huyết áp',
        'Do áp lực khoang màng phổi cao đè bẹp tĩnh mạch chủ làm giảm máu hồi lưu về tim',
        'Do kích thích dây thần kinh phế vị gây chậm nhịp tim',
        'Do phổi bên đối diện bị giãn quá mức làm vỡ phế nang'
      ],
      correctIndex: 1,
      explanation:
        'Áp lực dương tính rất lớn trong khoang màng phổi đẩy lệch trung thất, đè bẹp các tĩnh mạch chủ lớn làm máu nghèo oxy không thể về tim phải, gây sốc tắc nghẽn cấp.'
    }
  },
  {
    id: 'case_knee_acl_tear',
    title: 'Ca 4: Đứt dây chằng chéo trước (ACL) khớp gối thể thao',
    modality: 'mri',
    modalityName: 'Cộng hưởng từ Khớp gối (Knee Joint MRI Sagittal T2)',
    region: 'lower_limb',
    regionName: 'Chi dưới & Khớp gối',
    targetPartId: 'knee_joint',
    targetPartNameVi: 'Dây chằng chéo trước khớp gối',
    nameLatin: 'Ligamentum cruciatum anterius (ACL)',
    targetSystem: 'joints',
    plane: 'sagittal',
    sliceDepthCm: 12.0,
    view3DHash: '#sys=joints,skeletal&cam=0.1,0.5,1.2,0,0.48,0&sel=patella',
    patientHistory:
      'Cầu thủ bóng đá 24 tuổi, khi xoay vặn trụ gối để sút bóng bị cầu thủ đối phương va chạm. Bệnh nhân cảm thấy tiếng "bốp" (pop) đứt trong gối, ngã quỵ xuống sân và khớp gối sưng phù to nhanh chóng sau 2 giờ.',
    symptoms: [
      'Tràn dịch - tràn máu khớp gối (Hemarthrosis) làm khớp gối căng tức, biến mất các hõm tự nhiên',
      'Nghiệm pháp Lachman dương tính rõ rệt (độ giãn mâm chày > 5mm và không có điểm dừng chắc chắn)',
      'Nghiệm pháp ngăn kéo trước (Anterior Drawer Test) dương tính',
      'Cảm giác "lỏng khớp gối", không tự tin khi bước xuống cầu thang hoặc chạy đổi hướng'
    ],
    imagingFindings:
      'Trên phim MRI Sagittal T2: Mất liên tục hoàn toàn dải sợi dây chằng chéo trước; thớ gân bị gián đoạn thay thế bằng ổ dịch phù nề tăng tín hiệu màu sáng; đụng dập tủy xương (bone bruise) đặc trưng ở lồi cầu đùi ngoài và mâm chày sau ngoài.',
    anatomicalCorrelation:
      'Dây chằng chéo trước (ACL) bám từ diện gian lồi cầu trước mâm chày chạy chéo lên trên, ra sau và ra ngoài để bám vào mặt trong lồi cầu ngoài xương đùi. Chức năng cơ học chính là giữ cho mâm chày không bị trượt ra phía trước so với đầu dưới xương đùi và kiểm soát chuyển động xoay trong của cẳng chân. Khi đứt ACL, khớp gối mất vững xoay và trượt, lâu dài sẽ gây rách sụn chêm thứ phát và thoái hóa khớp gối sớm.',
    commonPitfalls:
      'Khám lâm sàng ngay sau chấn thương thường khó khăn do khớp gối sưng đau và phản xạ co cứng cơ tứ đầu đùi. Nghiệm pháp Lachman ở tư thế gấp gối 20-30° có độ nhạy và độ đặc hiệu cao hơn nghiệm pháp ngăn kéo trước ở tư thế 90°.',
    hotspots: [
      {
        id: 'hs_femoral_condyle',
        x: 42,
        y: 35,
        label: 'Lồi cầu ngoài xương đùi',
        partId: 'femur',
        partNameVi: 'Lồi cầu đùi',
        nameLatin: 'Condylus lateralis femoris',
        system: 'skeletal',
        clinicalSignificance: 'Nơi bám của đầu trên dây chằng chéo trước.'
      },
      {
        id: 'hs_acl_tear',
        x: 48,
        y: 47,
        label: 'Vị trí đứt rách dây chằng chéo trước',
        partId: 'joints',
        partNameVi: 'Dây chằng chéo trước (ACL)',
        nameLatin: 'Ligamentum cruciatum anterius',
        system: 'joints',
        clinicalSignificance: 'Mất liên tục thớ sợi; tăng tín hiệu phù nề trên T2.'
      },
      {
        id: 'hs_tibial_plateau',
        x: 52,
        y: 60,
        label: 'Mâm chày (Tibial plateau)',
        partId: 'skeletal',
        partNameVi: 'Xương chày',
        nameLatin: 'Tibia',
        system: 'skeletal',
        clinicalSignificance: 'Nơi bám của đầu dưới ACL tại diện gian lồi cầu trước.'
      }
    ],
    clinicalQuiz: {
      question:
        'Chức năng cơ sinh học chính yếu nhất của Dây chằng chéo trước (ACL) trong khớp gối là gì?',
      options: [
        'Ngăn cản mâm chày trượt ra sau so với xương đùi',
        'Ngăn cản mâm chày trượt ra trước so với xương đùi và kiểm soát độ xoay',
        'Giữ cho xương bánh chè không bị trật khớp ra ngoài',
        'Tăng tiết dịch nhầy bôi trơn cho sụn chêm'
      ],
      correctIndex: 1,
      explanation:
        'ACL là cấu trúc chính chống lại sự trượt ra trước của xương chày so với xương đùi (chiếm 85% lực cản). Khi đứt ACL, mâm chày tự do trượt ra trước gây mất vững gối.'
    }
  },
  {
    id: 'case_ultrasound_fast_spleen',
    title: 'Ca 5: Siêu âm FAST chấn thương bụng kín phát hiện vỡ lách & tụ máu khoang lách - thận',
    modality: 'ultrasound',
    modalityName: 'Siêu âm Cấp cứu FAST (Focused Assessment with Sonography in Trauma)',
    region: 'abdomen',
    regionName: 'Ổ bụng & Tạng tiêu hóa',
    targetPartId: 'spleen',
    targetPartNameVi: 'Lách & Khoang lách - thận',
    nameLatin: 'Splen (Lien) & Recessus splenorenalis',
    targetSystem: 'visceral',
    plane: 'coronal',
    sliceDepthCm: 18.0,
    view3DHash: '#sys=visceral&cam=-0.8,1.0,1.5,0,0.95,0&sel=spleen&iso=spleen',
    patientHistory:
      'Bệnh nhân nam, 22 tuổi, té xe đạp ghi đông đập mạnh vào hạ sườn trái. Sau ngã đau tức dữ dội vùng hạ sườn trái lan lên vai, da xanh tái, vã mồ hôi, huyết áp tụt 90/60 mmHg.',
    symptoms: [
      'Đau nhói hạ sườn trái lan lên chóp vai trái (Dấu hiệu Kehr điển hình do kích thích thần kinh hoành)',
      'Phản ứng thành bụng nhẹ và đề kháng cục bộ vùng hạ sườn trái',
      'Mạch nhanh 115 ck/phút, da niêm mạc nhợt nhạt, biểu hiện sốc mất máu nội tạng'
    ],
    imagingFindings:
      'Đầu dò siêu âm Convex tại khoang liên sườn 9-10 đường nách sau: Xuất hiện dải trống âm (anechoic - màu đen hoàn toàn) dày 14mm ngăn cách giữa cực dưới của lách và cực trên thận trái (khoang lách - thận Koller); vỏ bao lách mất liên tục; nhu mô lách có ổ tụ máu không đồng nhất.',
    anatomicalCorrelation:
      'Lách nằm sâu trong ô dưới hoành trái, được bao bọc bởi các xương sườn 9, 10, 11. Là tạng đặc giàu mạch máu nhất ổ bụng, khi có lực đập dập, lách là tạng dễ bị tổn thương nhất trong chấn thương bụng kín. Máu chảy tràn vào ổ phúc mạc sẽ dồn về các vùng trũng trọng lực gồm: Khoang Morrison (gan - thận), ngách lách - thận và túi cùng Douglas.',
    commonPitfalls:
      'Siêu âm FAST âm tính trong 1-2 giờ đầu không loại trừ tụ máu dưới bao lách (subcapsular hematoma). Tụ máu dưới bao có thể vỡ thì 2 sau nhiều giờ hoặc nhiều ngày gây sốc mất máu muộn.',
    hotspots: [
      {
        id: 'hs_spleen_parenchyma',
        x: 42,
        y: 36,
        label: 'Nhu mô lách (Splen)',
        partId: 'spleen',
        partNameVi: 'Lách',
        nameLatin: 'Splen',
        system: 'visceral',
        clinicalSignificance: 'Tạng đặc dễ vỡ nhất trong chấn thương bụng kín; giàu lưới mạch xoang.'
      },
      {
        id: 'hs_splenorenal_fluid',
        x: 52,
        y: 48,
        label: 'Dải máu trống âm khoang lách - thận',
        partId: 'visceral',
        partNameVi: 'Khoang lách - thận',
        nameLatin: 'Recessus splenorenalis',
        system: 'visceral',
        clinicalSignificance: 'Chỉ điểm xuất huyết nội cấp tính; bắt buộc hồi sức và can thiệp ngoại khoa.'
      },
      {
        id: 'hs_left_kidney',
        x: 60,
        y: 62,
        label: 'Cực trên thận trái (Ren sinister)',
        partId: 'visceral',
        partNameVi: 'Thận trái',
        nameLatin: 'Ren sinister',
        system: 'visceral',
        clinicalSignificance: 'Mốc giải phẫu phân định giới hạn sau dưới của khoang lách - thận.'
      }
    ],
    clinicalQuiz: {
      question:
        'Dấu hiệu đau nhói hạ sườn trái lan lên chóp vai trái (Dấu hiệu Kehr) trong vỡ lách được giải thích theo cơ chế thần kinh nào?',
      options: [
        'Máu tụ kích thích phúc mạc cơ hoành do dây thần kinh hoành (C3-C5) chi phối gây đau quy chiếu lên vai',
        'Do áp lực dây thần kinh tọa bị chèn ép phản xạ',
        'Do co thắt dây thần kinh gian sườn dưới cùng bên',
        'Do đứt rách động mạch lách làm thiếu máu cơ tim'
      ],
      correctIndex: 0,
      explanation:
        'Mặt dưới cơ hoành được chi phối bởi dây thần kinh hoành xuất phát từ rễ cổ C3-C5. Máu kích thích phúc mạc hoành gây đau quy chiếu về vùng da vai có cùng chi phối cảm giác rễ cổ C3-C5.'
    }
  },
  {
    id: 'case_cross_section_t4_t5',
    title: 'Ca 6: Lát cắt ngang giải phẫu lồng ngực qua đốt sống T4-T5 (Mặt phẳng ngang ngực - Góc Louis)',
    modality: 'cross_section',
    modalityName: 'Lát cắt Giải phẫu Ngang & Đối chiếu CT (Axial Gross Cross-section T4-T5)',
    region: 'thorax',
    regionName: 'Lồng ngực & Trung thất',
    targetPartId: 'heart',
    targetPartNameVi: 'Quai động mạch chủ & Trung thất trên',
    nameLatin: 'Arcus aortae & Mediastinum superius',
    targetSystem: 'cardiovascular',
    plane: 'axial',
    sliceDepthCm: 14.5,
    view3DHash: '#sys=cardiovascular,skeletal,visceral&cam=0,1.35,1.5,0,1.25,0',
    patientHistory:
      'Học phần giải phẫu định khu lồng ngực: Đối chiếu tiêu bản lát cắt ngang giải phẫu đông lạnh (Cryosection) của người trưởng thành với phim chụp CT lồng ngực cửa sổ trung thất qua mức góc xương ức (Góc Louis).',
    symptoms: [
      'Mặt phẳng mốc giải phẫu học quan trọng nhất trong phân chia trung thất',
      'Điểm mốc phân cách giữa trung thất trên và trung thất dưới',
      'Nơi bắt đầu và kết thúc của quai động mạch chủ'
    ],
    imagingFindings:
      'Trên lát cắt ngang qua đĩa đệm T4-T5: Quai động mạch chủ uốn cong rõ rệt từ trước ra sau và lệch sang trái; Khí quản phân chia thành 2 phế quản chính tại cựa khí quản (Carina); Tĩnh mạch đơn quặt ngược đổ vào Tĩnh mạch chủ trên; Thực quản nằm sát mặt sau khí quản.',
    anatomicalCorrelation:
      'Mặt phẳng ngang ngực (Transverse thoracic plane) đi qua góc ức phía trước và đĩa gian đốt T4-T5 phía sau là mốc kinh điển trong giải phẫu định khu: (1) Phân cách trung thất trên và trung thất dưới; (2) Quai ĐM chủ bắt đầu và tận hết; (3) Khí quản phân đôi tại Carina; (4) Thần kinh thanh quản quặt ngược trái vòng dưới quai ĐM chủ; (5) Tĩnh mạch đơn cong qua cuống phổi phải để đổ vào TMC trên.',
    commonPitfalls:
      'Góc xương ức (Góc Louis) sờ thấy gồ nhẹ dưới da là mốc định chuẩn để đếm khoang liên sườn 2 trên lâm sàng (ngay dưới sụn sườn 2) để xác định vị trí nghe tim hoặc chọc dò màng phổi.',
    hotspots: [
      {
        id: 'hs_aortic_arch',
        x: 48,
        y: 40,
        label: 'Quai động mạch chủ (Arcus aortae)',
        partId: 'cardiovascular',
        partNameVi: 'Quai động mạch chủ',
        nameLatin: 'Arcus aortae',
        system: 'cardiovascular',
        clinicalSignificance: 'Mạch máu lớn nhất cấp máu nuôi toàn bộ cơ thể; quặt từ trước ra sau ở T4-T5.'
      },
      {
        id: 'hs_trachea_carina',
        x: 53,
        y: 52,
        label: 'Cựa khí quản (Carina tracheae)',
        partId: 'visceral',
        partNameVi: 'Cựa khí quản',
        nameLatin: 'Carina tracheae',
        system: 'visceral',
        clinicalSignificance: 'Nơi khí quản chia đôi thành 2 phế quản chính; mốc quan trọng trong nội soi phế quản.'
      },
      {
        id: 'hs_svc',
        x: 40,
        y: 42,
        label: 'Tĩnh mạch chủ trên (Vena cava superior)',
        partId: 'cardiovascular',
        partNameVi: 'Tĩnh mạch chủ trên',
        nameLatin: 'Vena cava superior',
        system: 'cardiovascular',
        clinicalSignificance: 'Nhận máu từ nửa trên cơ thể; nhận quai tĩnh mạch đơn đổ vào ở mức T4.'
      }
    ],
    clinicalQuiz: {
      question:
        'Mặt phẳng ngang ngực đi qua Góc xương ức và đĩa đệm T4-T5 KHÔNG phải là mốc giải phẫu của cấu trúc nào sau đây?',
      options: [
        'Khí quản phân đôi thành 2 phế quản chính tại Carina',
        'Quai động mạch chủ bắt đầu và kết thúc',
        'Động mạch chủ bụng chia đôi thành 2 động mạch chậu chung',
        'Tĩnh mạch đơn uốn cong đổ vào tĩnh mạch chủ trên'
      ],
      correctIndex: 2,
      explanation:
        'Động mạch chủ bụng chia đôi thành 2 động mạch chậu chung ở ngang mức đốt sống thắt lưng L4, hoàn toàn không thuộc mặt phẳng ngực T4-T5.'
    }
  }
];

export function getClinicalCases(): ClinicalCase[] {
  return CLINICAL_CASES;
}

export function getClinicalCaseById(id: string): ClinicalCase | undefined {
  return CLINICAL_CASES.find(c => c.id === id);
}
